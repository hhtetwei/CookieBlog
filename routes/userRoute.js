const router = require("express").Router();

const {
  getAllUsers,
  getByUserId,
  getAllMutualFriends,
} = require("./../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getByUserId);

router.get("/mutual/:id", getAllMutualFriends);

module.exports = router;
