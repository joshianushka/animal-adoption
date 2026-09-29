const router = require("express").Router();
const c = require("../controllers/animalController");

router.route("/").get(c.getAnimals).post(c.createAnimal);
router.route("/:id").get(c.getAnimal).put(c.updateAnimal).delete(c.deleteAnimal);

module.exports = router;