const SharedPosts = require("./../models/sharedModel");
const Posts = require("./../models/postModel");
const Users = require("./../models/userModel");

const createShare = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // const userId = await Users.findById(requestedBy);
    const { sharedCaption } = req.body;
    const postId = await Posts.findById(req.params.id);

    const isShared = await SharedPosts.findOne({ postId });
    if (isShared) {
      return res.status(400).json("You have aleady shared this post!");
    }

    const newSharedPost = new SharedPosts({
      postId,
      userId,
      sharedCaption: sharedCaption,
    });
    await newSharedPost.save();

    return res.status(200).json({
      status: true,
      message: "You have shared this post",
    });
  } catch (err) {
    next(err);
  }
};

const updateShare = async (req, res, next) => {
  try {
    // const postId = await SharedPosts.findById(req.params.id);
    const { sharedCaption } = req.body;

    await SharedPosts.findByIdAndUpdate(req.params.id, { sharedCaption }); //mongo find methods only accept objects as their second parameter

    return res.status(200).json({
      status: 200,
      msg: "Your Shared Caption has been successfully updated!",
    });
  } catch (err) {
    next(err);
  }
};

const getAllSharedPosts = async (req, res, next) => {
  try {
    const sharePosts = await SharedPosts.find();
    return res.status(200).json({
      status: true,
      sharePosts: sharePosts,
    });
  } catch (err) {
    next(err);
  }
};

const getSharePostById = async (req, res, next) => {
  try {
    const sharePosts = await SharedPosts.findById(req.params.id);
    return res.status(200).json({
      sharePosts: sharePosts,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSharePosts = async (req, res, next) => {
  try {
    const sharePosts = await SharedPosts.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createShare,
  updateShare,
  getAllSharedPosts,
  getSharePostById,
  deleteSharePosts,
};
