const router = require("express").Router();

const postValidator = require("../validators/post/postValidator");
const {
  createPosts,
  updatePost,
  getAllPosts,
  deletePost,
  getPostById,
  save,
  clickLike,
  unsaved,
  likePost,
} = require("./../controllers/postController");

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post("/", postValidator, createPosts);
// router.put("/:id/like", clik);

router.put("/:id", updatePost);
router.put("/:id/save", save);
router.put("/:id/unsave", unsaved);
router.put("/:id/liked", clickLike);

router.delete("/:id", deletePost);

module.exports = router;
