const router = require("express").Router();
const {
  createShare,
  updateShare,
  getAllSharedPosts,
  getSharePostById,
  deleteSharePosts,
} = require("./../controllers/shareController");

router.get("/", getAllSharedPosts);
router.get("/:id", getSharePostById);

router.post("/:id", createShare);

router.put("/:id", updateShare);

router.delete("/:id", deleteSharePosts);

module.exports = router;
