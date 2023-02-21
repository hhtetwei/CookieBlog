const router = require("express").Router();

// const activeNow = require("./../middlewares/activeNow");
const newsFeedController = require("../controllers/newsFeedController");

router.get("/", newsFeedController.getNewsFeed);

module.exports = router;
