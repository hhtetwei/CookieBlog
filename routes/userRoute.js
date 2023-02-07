const router = require("express").Router();

const { getAllUsers, createUsers } = require("./../controllers/userController");

router.get("/", getAllUsers);
router.post("/", createUsers);

module.exports = router;
