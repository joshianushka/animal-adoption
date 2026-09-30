const Adopter = require("../models/Adopter");

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Adopter.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "No adopter profile yet" });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.saveMyProfile = async (req, res) => {
  try {
    const { user, ...data } = req.body;   
    const profile = await Adopter.findOneAndUpdate(
      { user: req.user.id },
      { ...data, user: req.user.id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};