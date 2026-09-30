const router = require("express").Router();
const c = require("../controllers/animalController");
const { protect, requireRole } = require("../middleware/auth");
const shelter = [protect, requireRole("shelter")];

router.get("/", c.getAnimals);
router.get("/mine", ...shelter, c.getMyAnimals);
router.post("/predict-speed", ...shelter, c.predictSpeed);
router.post("/", ...shelter, c.createAnimal);
router.get("/:id", c.getAnimal);
router.put("/:id", ...shelter, c.updateAnimal);
router.delete("/:id", ...shelter, c.deleteAnimal);

module.exports = router;