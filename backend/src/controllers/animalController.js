const Animal = require("../models/Animal");
const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

exports.createAnimal = async (req, res) => {
  try {
    const { shelter, status, ...data } = req.body;      // never trust these from the client
    const animal = await Animal.create({ ...data, shelter: req.user.id });
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

exports.getMyAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ shelter: req.user.id }).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.predictSpeed = async (req, res) => {
  try {
    const { data } = await axios.post(`${ML_URL}/predict/adoption-speed/from-app`, req.body, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({ message: "Prediction service is unavailable" });
    }
    res.status(err.response?.status || 500).json({ message: err.response?.data?.detail || err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const { shelter, ...data } = req.body;
    const animal = await Animal.findOneAndUpdate(
      { _id: req.params.id, shelter: req.user.id },      // only the owner can edit
      data,
      { new: true, runValidators: true }
    );
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findOneAndDelete({ _id: req.params.id, shelter: req.user.id });
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json({ message: "Animal deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};