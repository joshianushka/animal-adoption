const mongoose = require("mongoose");

const adopterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    housingType: { type: String, enum: ["apartment", "house", "house_with_yard"], required: true },
    hasChildren: { type: Boolean, default: false },
    hasDogs: { type: Boolean, default: false },
    hasCats: { type: Boolean, default: false },
    experienceLevel: { type: String, enum: ["first_time", "some", "experienced"], required: true },
    activityLevel: { type: String, enum: ["low", "medium", "high"], required: true },
    hoursAloneDaily: { type: Number, min: 0, max: 24, default: 6 },
    preferredSpecies: [{ type: String, enum: ["dog", "cat"] }],
    preferredSizes: [{ type: String, enum: ["small", "medium", "large"] }],
    preferredAgeGroups: [{ type: String, enum: ["young", "adult", "senior"] }],
    hasAllergies: { type: Boolean, default: false },
    maxAdoptionFee: { type: Number, default: 0, min: 0 },
    openToSpecialNeeds: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adopter", adopterSchema);