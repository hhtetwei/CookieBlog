const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: "",
  },

  comments: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Comments", commentSchema);
