
const router = require("express").Router();

const {
  getMyProfile,
  saveMyProfile,
} = require("../controllers/adopterController");

const { protect, requireRole } = require("../middleware/auth");

router.use(protect, requireRole("adopter"));

router.get("/me", getMyProfile);
router.put("/me", saveMyProfile);

module.exports = router;