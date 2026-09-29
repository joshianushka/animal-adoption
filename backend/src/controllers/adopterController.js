const Adopter = require("../models/Adopter");

// Until you build login, pass a user id in the x-user-id header (dev only).
// Later, replace this with req.user.id from your JWT middleware.
const getUserId = (req) => req.user?.id || req.header("x-user-id");

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Adopter.findOne({ user: getUserId(req) });
    if (!profile) return res.status(404).json({ message: "No adopter profile yet" });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create or update in one call
exports.saveMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const profile = await Adopter.findOneAndUpdate(
      { user: userId },
      { ...req.body, user: userId },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};