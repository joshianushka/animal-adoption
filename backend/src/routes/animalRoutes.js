const express = require("express");

const {
  createAnimal,
  getAnimals,
  getAnimal,
  deleteAnimal,
} = require("../controllers/animalController");

const router = express.Router();

router.post("/", createAnimal);
router.get("/", getAnimals);
router.get("/:id", getAnimal);
router.delete("/:id", deleteAnimal);

module.exports = router;