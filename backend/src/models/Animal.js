const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["dog", "cat", "other"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },

    energyLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    temperament: {
      type: String,
      enum: ["calm", "friendly", "playful", "shy", "energetic"],
      required: true,
    },

    goodWithChildren: {
      type: Boolean,
      default: false,
    },

    goodWithDogs: {
      type: Boolean,
      default: false,
    },

    goodWithCats: {
      type: Boolean,
      default: false,
    },

    trainingLevel: {
      type: String,
      enum: ["none", "basic", "trained"],
      default: "none",
    },

    medicalNeeds: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    adoptionStatus: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Animal", animalSchema);