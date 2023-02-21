const router = require("express").Router();

const {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
} = require("./../controllers/commentController");

const { userAuth } = require("./../middlewares/userAuth");

router.get("/", getAllComments);
router.post("/:id", userAuth, createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
