const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
    adopter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, maxlength: 1000 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

schema.index({ animal: 1, adopter: 1 }, { unique: true }); // one request per adopter per animal

module.exports = mongoose.model("AdoptionRequest", schema);