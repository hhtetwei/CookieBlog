const router = require("express").Router();
const newsFeedController = require("../controllers/newsFeedController");

router.get("/", newsFeedController.getNewsFeed);

module.exports = router;
