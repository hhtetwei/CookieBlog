const router = require("express").Router();

const {
  sendFriReq,
  confirmFriReq,
  declineFriReq,
  getAllFriReq,
  blockUser,
  getAllBlockList,
  getAllFriList,
  unfri,
  unblock,
  searchUsers,
} = require("./../controllers/friRequestController");

//middlewares
const blockAuth = require("./../middlewares/blockAuth");

router.get("/search", blockAuth, searchUsers);
router.post("/send/:id", sendFriReq);
router.get("/blocklist", getAllBlockList);
router.get("/frilist", getAllFriList);
router.get("/", getAllFriReq);

router.put("/:id/confirm", confirmFriReq);
router.put("/:id/decline", declineFriReq);
router.put("/:id/block", blockUser);
router.put("/:id/unfri", unfri);
router.put("/:id/unblock", unblock);

module.exports = router;
