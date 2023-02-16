const FriendRequests = require("../models/friendRequest.model");
const Users = require("../models/userModel");

const sendFriReq = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sender = await Users.findById(userId);
    const receiver = await Users.findById(req.params.id);

    if (sender._id.toString() === receiver._id.toString()) {
      //always covert the object ID to the string
      return res.status(401).json({
        status: 401,
        message: "You can't add friend yourself!",
      });
    }

    if (sender.friends.includes(receiver._id)) {
      return res.status(401).json({
        status: 401,
        message: "You are already friends with this user !",
      });
    }

    const newRequest = new FriendRequests({
      sender,
      receiver,
      status: "pending",
    });
    await newRequest.save();

    return res.status(200).json({
      status: true,
      message: "You have sent Friend Request",
    });
  } catch (err) {
    next(err);
  }
};

const unfri = async (req, res, next) => {
  try {
    const userId = req.user.id; //getting the userid from login cookie
    const sender = await Users.findById(userId);
    const receiver = await Users.findById(req.body.userId);

    await Users.findByIdAndUpdate(receiver._id, {
      $pull: { friends: sender._id },
    });

    await Users.findByIdAndUpdate(sender._id, {
      $pull: { friends: receiver._id },
    });

    return res.status(200).json({
      status: true,
      message: "You have unfriended this user!",
    });
  } catch (err) {
    next(err);
  }
};
const confirmFriReq = async (req, res, next) => {
  try {
    const userId = req.user.id; //getting the userid from login cookie
    // const receiver = await Users.findById(req.body.userId);
    // const sender = await Users.findById(userId);

    const { sender, receiver } = await FriendRequests.findById(req.params.id);

    if (sender.toString() === userId) {
      res
        .status(401)
        .json("You cannot confirm yourself.Only the receiver can.");
    }

    await FriendRequests.findByIdAndUpdate(req.params.id, {
      status: "confirmed",
    });
    await Users.findByIdAndUpdate(receiver, {
      $push: { friends: sender },
    });
    await Users.findByIdAndUpdate(sender, {
      $push: { friends: receiver },
    });

    return res.status(200).json({
      status: true,
      message: "You are friend with this user now",
    });
  } catch (err) {
    next(err);
  }
};

const declineFriReq = async (req, res, next) => {
  try {
    userId = req.user.id;
    const sender = await Users.findById(req.body.userId);
    const receiver = await Users.findById(userId);

    await FriendRequests.findByIdAndUpdate(req.params.id, {
      status: "declined",
    });

    return res.status(200).json({
      status: true,
      message: "You declined this user request!",
    });
  } catch (err) {
    next(err);
  }
};

const getAllFriReq = async (req, res, next) => {
  try {
    const requests = await FriendRequests.find({ status: { $eq: "pending" } });

    return res.status(200).json({
      status: true,
      FriendRequests: requests,
    });
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const receiver = await Users.findById(req.body.userId);
    const sender = await Users.findById(userId);

    if (sender.blockedUsers.includes(receiver._id)) {
      return res.status(401).json({
        status: 401,
        message:
          "You have already blocked this user. See it in your block List!",
      });
    }
    await Users.findByIdAndUpdate(sender._id, {
      $addToSet: { blockedUsers: receiver },
    });
    await Users.findByIdAndUpdate(sender._id, {
      $pull: { friends: receiver._id },
    });
    await Users.findByIdAndUpdate(receiver._id, {
      $pull: { friends: sender._id },
    });

    return res.status(200).json({
      status: true,
      message: "You have blocked this user",
    });
  } catch (err) {
    next(err);
  }
};

const unblock = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const receiver = await Users.findById(req.body.userId);
    const sender = await Users.findById(userId);

    await Users.findByIdAndUpdate(sender._id, {
      $pull: { blockedUsers: receiver._id },
    });

    return res.status(200).json({
      status: true,
      message: "You have unblocked this user!",
    });
  } catch (err) {
    next(err);
  }
};
const getAllBlockList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId).populate({
      path: "blockedUsers",
      select: "name profilePicture",
    });

    return res.status(200).json({
      status: true,
      BlockedList: user.blockedUsers,
    });
  } catch (err) {
    next(err);
  }
};
const getAllFriList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId)
      .populate({
        path: "friends",
        select: "name profilePicture",
      })
      .exec();

    return res.status(200).json({
      status: true,
      FriendList: user.friends,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendFriReq,
  confirmFriReq,
  declineFriReq,
  getAllFriReq,
  blockUser,
  getAllBlockList,
  getAllFriList,
  unfri,
  unblock,
};
