const mongoose = require("mongoose");

const sharedSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  sharedCaption: {
    type: String,
  },
});

module.exports = mongoose.model("share", sharedSchema);
