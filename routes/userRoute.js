const router = require("express").Router();

const {
  getAllUsers,
  getByUserId,
  getAllMutualFriends,
  updateProfileInfos,
} = require("./../controllers/userController");

//middlewares

const {
  profileUpdateValidator,
} = require("./../validators/auth/profileUpdateInfos");

router.get("/", getAllUsers);
router.get("/:id", getByUserId);
router.get("/mutual/:id", getAllMutualFriends);

router.put("/me", profileUpdateValidator, updateProfileInfos);

module.exports = router;
