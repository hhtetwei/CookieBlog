const router = require("express").Router();

const {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
} = require("./../controllers/commentController");

const { userAuth } = require("./../middlewares/userAuth");

router.post("/", userAuth, createComment);
router.get("/", getAllComments);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
