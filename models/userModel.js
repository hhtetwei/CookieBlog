const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
    },

    pictureUrls: [
      {
        type: String,
        default:
          "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
      },
    ],

    picPublicIds: [
      {
        type: String,
        default: "PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
      },
    ],

    DOB: {
      type: Date,
      // required: [true, "Birthday need to be inserted"],
      default: "",
    },

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: "",
      },
    ],

    mutualFriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    lastActiveTimestamp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("isActive").get(function () {
  console.log("test");
  if (!this.lastActiveTimestamp) return false;

  return moment().utc().diff(this.lastActiveTimestamp, "seconds") < 30;
});

// module.exports = mongoose.model("Users", userSchema);
const Users = mongoose.model("Users", userSchema);

module.exports = Users;
