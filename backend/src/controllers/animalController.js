const Animal = require("../models/Animal");

exports.createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create({ ...req.body, shelter: req.user?.id || req.body.shelter });
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const { species, size, status = "available", page = 1, limit = 12, search } = req.query;
    const filter = { status };
    if (species) filter.species = species;
    if (size) filter.size = size;
    if (search) filter.name = { $regex: search, $options: "i" };

    const animals = await Animal.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Animal.countDocuments(filter);
    res.json({ animals, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json({ message: "Animal deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};