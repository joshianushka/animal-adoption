const Animal = require("../models/Animal");

// CREATE ANIMAL
const createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);

    res.status(201).json({
      success: true,
      animal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ANIMALS
const getAnimals = async (req, res) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      animals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ONE ANIMAL
const getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    res.status(200).json({
      success: true,
      animal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ANIMAL
const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Animal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAnimal,
  getAnimals,
  getAnimal,
  deleteAnimal,
};