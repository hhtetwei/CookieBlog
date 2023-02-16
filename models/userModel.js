const mongoose = require("mongoose");

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
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
    },
    coverPhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
    },
    featuredPhotos: [
      {
        type: String,
        default:
          "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
      },
    ],

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
      required: [true, "Birthday need to be inserted"],
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

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: "",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("Users", userSchema);
const Users = mongoose.model("Users", userSchema);

module.exports = Users;
