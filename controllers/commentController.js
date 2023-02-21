const Comments = require("../models/commentModel");
const Posts = require("./../models/postModel");

const createComment = async (req, res, next) => {
  try {
    const { comments } = req.body;
    const postId = await Posts.findById(req.params.id);

    await Posts.findByIdAndUpdate(postId, {
      $push: { comments: { commentedUser: req.user.id, comments } },
    });

    const userId = req.user.id;
    const result = await Comments.create({
      postId,
      comments,
      userId,
    });

    res.status(200).json({
      status: 200,
      comment: result,
      userId: userId,
      message: "New comment is successfully created",
    });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comments.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!comment) {
      return res.status(400).json({
        status: 400,
        message: "No comment has been found by this ID",
      });
    }
    res.status(200).json({
      status: true,
      message: "Comment is successfully updated!",
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comments.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(400).json({
        status: false,
        message: "No Id has been found by this comment ID",
      });
    }
    res.status(200).json({
      status: true,
      message: "Comment is successfully deleted!",
    });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const limitStage = limit * 1;
    const skipStage = (page - 1) * limit;

    const postLookup = {
      from: "posts",
      localField: "postId",
      foreignField: "_id",
      as: "postDetails",
    };

    const pipelines = [
      { $lookup: postLookup },
      { $unwind: "$postDetails" },
      { $skip: skipStage },
      { $limit: limitStage },
    ];

    const comment = await Comments.aggregate(pipelines);

    return res.status(200).json({ status: 200, comment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
};
