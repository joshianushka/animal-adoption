const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ["dog", "cat"], required: true },
    breed: { type: String, trim: true },
    isMixedBreed: { type: Boolean, default: false },
    ageMonths: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ["male", "female"], required: true },
    size: { type: String, enum: ["small", "medium", "large"], required: true },
    color: { type: String, trim: true },
    coatLength: { type: String, enum: ["short", "medium", "long"], default: "short" },
    energyLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    temperament: [{ type: String }],

    goodWithKids: { type: Boolean, default: false },
    goodWithDogs: { type: Boolean, default: false },
    goodWithCats: { type: Boolean, default: false },

    // used by the matcher
    needsYard: { type: Boolean, default: false },
    specialNeeds: { type: Boolean, default: false },
    experienceRequired: { type: String, enum: ["first_time", "some", "experienced"], default: "first_time" },
    maxHoursAlone: { type: Number, default: 6, min: 0, max: 24 },

    // health (also useful for the adoption-speed model)
    vaccinated: { type: Boolean, default: false },
    dewormed: { type: Boolean, default: false },
    sterilized: { type: Boolean, default: false },
    healthCondition: { type: String, enum: ["healthy", "minor_injury", "serious_injury"], default: "healthy" },
    healthNotes: { type: String },

    adoptionFee: { type: Number, default: 0, min: 0 },
    description: { type: String, maxlength: 2000 },
    photos: [{ type: String }],
    status: { type: String, enum: ["available", "pending", "adopted"], default: "available" },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

animalSchema.index({ species: 1, status: 1, size: 1 });

module.exports = mongoose.model("Animal", animalSchema);