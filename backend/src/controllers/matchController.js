const axios = require("axios");
const Adopter = require("../models/Adopter");
const Animal = require("../models/Animal");
const mongoose = require("mongoose");   

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
const getUserId = (req) => req.user?.id || req.header("x-user-id");

exports.getMyMatches = async (req, res) => {
  try {
    console.log("DB name:        ", mongoose.connection.name);
    console.log("userId received:", getUserId(req));
    console.log("adopters in DB: ", await Adopter.countDocuments());
    const adopter = await Adopter.findOne({ user: getUserId(req) }).lean();
    if (!adopter) {
      return res.status(404).json({ message: "Complete the questionnaire first" });
    }

    const animals = await Animal.find({ status: "available" }).limit(200).lean();
    if (animals.length === 0) return res.json([]);

    // FastAPI needs plain JSON, so stringify the ObjectIds
    const payload = {
      adopter,
      animals: animals.map((a) => ({ ...a, _id: String(a._id) })),
    };

    const { data: ranked } = await axios.post(`${ML_URL}/match/rank`, payload, { timeout: 10000 });

    // Join the scores back onto the full animal documents
    const byId = Object.fromEntries(animals.map((a) => [String(a._id), a]));
    const results = ranked.map((r) => ({
      ...r,
      animal: byId[r.animalId],
    }));

    res.json(results);
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({ message: "Matching service is unavailable" });
    }
    res.status(500).json({ message: err.message });
  }
};