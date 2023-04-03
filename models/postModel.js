const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Author is required"],
      ref: "Users",
    },

    caption: {
      type: String,
      required: [true, "Please Enter the caption of the post"],
      trim: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: "",
      },
    ],

    pictureUrls: [
      {
        type: String,
        default:
          "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/CookieBlog/Users/default-profile-picture_nop9jb.webp",
      },
    ],
    picPublicIds: [
      {
        type: String,
        default: "CookieBlog/Users/default-profile-picture_nop9jb.webp",
      },
    ],

    taggedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    seenUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    comments: [
      {
        commentedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },

        comments: String,
      },
    ],

    shareCount: {
      type: Number,
      default: 0,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    // share: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "users",
    //   },
    // ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
