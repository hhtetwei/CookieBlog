const mongoose = require("mongoose");

const sharedSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },

  sharedCaption: {
    type: String,
  },
});

module.exports = mongoose.model("share", sharedSchema);
