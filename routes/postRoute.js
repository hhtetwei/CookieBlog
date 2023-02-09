const router = require("express").Router();

const postValidator = require("../validators/post/postValidator");
const {
  createPosts,
  updatePost,
  getAllPosts,
  deletePost,
  getPostById,
} = require("./../controllers/postController");

router.post("/", postValidator, createPosts);
router.put("/:id", updatePost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

module.exports = router;
