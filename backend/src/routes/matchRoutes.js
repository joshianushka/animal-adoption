const router = require("express").Router();
const { getMyMatches } = require("../controllers/matchController");

router.get("/me", getMyMatches);

module.exports = router;