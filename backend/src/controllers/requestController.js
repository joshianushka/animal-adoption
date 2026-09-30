const AdoptionRequest = require("../models/AdoptionRequest");
const Animal = require("../models/Animal");

exports.createRequest = async (req, res) => {
  try {
    const animal = await Animal.findById(req.body.animalId);
    if (!animal || animal.status !== "available") {
      return res.status(400).json({ message: "This animal is no longer available" });
    }
    const request = await AdoptionRequest.create({
      animal: animal._id,
      adopter: req.user.id,
      shelter: animal.shelter,
      message: req.body.message,
    });
    res.status(201).json(request);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "You already requested this animal" });
    res.status(400).json({ message: err.message });
  }
};

exports.myRequests = async (req, res) => {
  const list = await AdoptionRequest.find({ adopter: req.user.id })
    .populate("animal", "name species photos status")
    .sort({ createdAt: -1 });
  res.json(list);
};

exports.shelterRequests = async (req, res) => {
  const list = await AdoptionRequest.find({ shelter: req.user.id })
    .populate("animal", "name species status")
    .populate("adopter", "name email")
    .sort({ createdAt: -1 });
  res.json(list);
};

exports.decide = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }
    const request = await AdoptionRequest.findOne({ _id: req.params.id, shelter: req.user.id });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request was already decided" });
    }
    request.status = status;
    await request.save();

    if (status === "approved") {
      await Animal.findByIdAndUpdate(request.animal, { status: "adopted" });
      await AdoptionRequest.updateMany(
        { animal: request.animal, _id: { $ne: request._id }, status: "pending" },
        { status: "rejected" }
      );
    }
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};