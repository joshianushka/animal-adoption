const router = require("express").Router();
const c = require("../controllers/requestController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/", protect, requireRole("adopter"), c.createRequest);
router.get("/mine", protect, requireRole("adopter"), c.myRequests);
router.get("/shelter", protect, requireRole("shelter"), c.shelterRequests);
router.patch("/:id", protect, requireRole("shelter"), c.decide);

module.exports = router;