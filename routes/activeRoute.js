const router = require("express").Router();

const isActive = require("./../middlewares/activeNow");

router.get("/", isActive);

module.exports = router;
