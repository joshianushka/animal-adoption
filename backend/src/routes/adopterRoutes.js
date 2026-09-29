const router = require("express").Router();
const c = require("../controllers/adopterController");

router.route("/me").get(c.getMyProfile).put(c.saveMyProfile);

module.exports = router;