const router = require("express").Router();
const {
  createShare,
  updateShare,
  getAllSharedPosts,
  getSharePostById,
  deleteSharePosts,
} = require("./../controllers/shareController");

router.post("/:id", createShare);
router.put("/:id", updateShare);
router.get("/", getAllSharedPosts);
router.get("/:id", getSharePostById);
router.delete("/:id", deleteSharePosts);

module.exports = router;
