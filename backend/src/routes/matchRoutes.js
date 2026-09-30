
const router = require("express").Router();

const { getMyMatches } = require("../controllers/matchController");

const { protect, requireRole } = require("../middleware/auth");

router.use(protect, requireRole("adopter"));

router.get("/me", getMyMatches);

module.exports = router;