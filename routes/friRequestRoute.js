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
} = require("./../controllers/friRequestController");

router.post("/:id", sendFriReq);
router.put("/:id/confirm", confirmFriReq);
router.put("/:id/decline", declineFriReq);
router.get("/", getAllFriReq);
router.put("/:id/block", blockUser);
router.get("/blocklist", getAllBlockList);
router.get("/frilist", getAllFriList);
router.put("/:id/unfri", unfri);
router.put("/:id/unblock", unblock);

module.exports = router;
