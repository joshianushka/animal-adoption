const axios = require("axios");
const Adopter = require("../models/Adopter");
const Animal = require("../models/Animal");
const AdoptionRequest = require("../models/AdoptionRequest");

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

exports.getMyMatches = async (req, res) => {
  try {
    const adopter = await Adopter.findOne({ user: req.user.id }).lean();
    if (!adopter) return res.status(404).json({ message: "Complete the questionnaire first" });

    const animals = await Animal.find({ status: "available" }).limit(200).lean();
    if (animals.length === 0) return res.json([]);

    const { data: ranked } = await axios.post(
      `${ML_URL}/match/rank`,
      { adopter, animals: animals.map((a) => ({ ...a, _id: String(a._id) })) },
      { timeout: 10000 }
    );

    const mine = await AdoptionRequest.find({ adopter: req.user.id }).select("animal status").lean();
    const requested = Object.fromEntries(mine.map((r) => [String(r.animal), r.status]));
    const byId = Object.fromEntries(animals.map((a) => [String(a._id), a]));

    res.json(ranked.map((r) => ({
      ...r,
      animal: byId[r.animalId],
      requestStatus: requested[r.animalId] || null,
    })));
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({ message: "Matching service is unavailable" });
    }
    res.status(500).json({ message: err.message });
  }
};