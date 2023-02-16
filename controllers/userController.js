const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// models
const Users = require("../models/userModel");

// services
const { uploadImages } = require("../services/uploadImages");
const { deleteImages } = require("../services/deleteImages");
const { createCustomId } = require("../services/createCustomId");

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: 400, msg: "Some required information are missing!" });
    }

    const userId = req.user.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, msg: "Something went wrong!" });
    }
    // check password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, msg: "Current password is incorrect!" });
    }
    // change password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await Users.findByIdAndUpdate(userId, {
      password: passwordHash,
    });

    return res.status(200).json({
      status: 200,
      msg: "Your password has been successfully changed!",
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: 400, msg: "Some required information are missing!" });
    }

    const userId = req.user.id;

    const user = await Users.findById(userId);

    let deletePromises = [];

    let oldPicPublicIds = user.picPublicIds;
    let oldPictureUrls = user.pictureUrls;

    // already exist photo in database
    if (oldPicPublicIds[0] !== "" && oldPictureUrls[0] !== "") {
      // delete old picture from cloudinary
      deletePromises = deleteImages(oldPicPublicIds);

      oldPicPublicIds = [""];
      oldPictureUrls = [""];
    }

    const uploadPromises = uploadImages(req.files, req.folderName);

    const updateUser = async (userId, payload) => {
      await Users.findByIdAndUpdate(userId, payload);
      return res.status(200).json({
        status: 200,
        msg: "Your profile has been successfully updated!",
      });
    };

    // include photo in request body
    const pictureUrls = [];
    const picPublicIds = [];

    Promise.all(deletePromises)
      .then(() => Promise.all(uploadPromises))
      .then(async (pictures) => {
        for (let i = 0; i < pictures.length; i++) {
          const { secure_url, public_id } = pictures[i];
          pictureUrls.push(secure_url);
          picPublicIds.push(public_id);
        }

        await updateUser(userId, {
          name,
          picPublicIds,
          pictureUrls,
        });
      });
  } catch (err) {
    next(err);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");

    return res.status(200).json({ status: 200, user });
  } catch (err) {
    next(err);
  }
};

// get all users
const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      start = "2023-01-01",
      end = "2024-01-01",
      name = "",
    } = req.query;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // stages
    const dateFilter = {
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    };
    const matchStage = {
      $or: [{ name: { $regex: name } }],
    };
    const projectStage = {
      password: 0,
    };
    const limitStage = limit * 1;
    const skipStage = (page - 1) * limit;

    const users = await Users.aggregate([
      { $match: dateFilter },
      { $match: matchStage },
      { $project: projectStage },
      { $sort: { id: -1 } },
      { $skip: skipStage },
      { $limit: limitStage },
    ]);

    return res.status(200).json({ status: 200, users });
  } catch (err) {
    next(err);
  }
};

const addFriends = async (req, res, next) => {
  // const senderId = await Users.find(req.body.userId)
  // const receiverId = await Users.find(req.params.id)
  // if (senderId._id !== receiverId._id) {
  //     try {
  //       if (!anotherUser.followers.includes(currentUser._id)) {
  //         await Users.updateOne(
  //           { _id: anotherUser._id },
  //           { $push: { followers: currentUser._id } }
  //         );

  try {
    const sender = await Users.findById(req.body.userId);
    const receiver = await Users.findById(req.params.id);

    if (req.body.userId === req.params.id) {
      return res.status(400).json({ message: "You can't add yourself!" });
    }

    if (receiver.friends.includes(sender._id)) {
      return res.status(400).json({ message: "Cannot add one user twice!" });
    }

    await Users.findByIdAndUpdate(receiver._id, {
      $push: { friends: sender._id },
    });

    return res.status(200).json({
      status: true,
      message: "You are friend with this user now",
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------- can do only SuperAdmin & Admin -------------------------------

const updateUser = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: 400, msg: "Some required information are missing!" });
    }

    const user = await Users.findById(req.params.id);

    let deletePromises = [];

    let oldPicPublicIds = user.picPublicIds;
    let oldPictureUrls = user.pictureUrls;

    // already exist photo in database
    if (oldPicPublicIds[0] !== "" && oldPictureUrls[0] !== "") {
      // delete old picture from cloudinary
      deletePromises = deleteImages(oldPicPublicIds);

      oldPicPublicIds = [""];
      oldPictureUrls = [""];
    }

    const uploadPromises = uploadImages(req.files, req.folderName);

    const updateUser = async (userId, payload) => {
      await Users.findByIdAndUpdate(userId, payload);
      return res.status(200).json({
        status: 200,
        msg: "This user's profile has been successfully updated!",
      });
    };

    // include photo in request body
    const pictureUrls = [];
    const picPublicIds = [];

    Promise.all(deletePromises)
      .then(() => Promise.all(uploadPromises))
      .then(async (pictures) => {
        for (let i = 0; i < pictures.length; i++) {
          const { secure_url, public_id } = pictures[i];
          pictureUrls.push(secure_url);
          picPublicIds.push(public_id);
        }

        await updateUser(req.params.id, {
          name,
          picPublicIds,
          pictureUrls,
        });
      });
  } catch (err) {
    next(err);
  }
};

const getAllMutualFriends = async (req, res, next) => {
  try {
    const me = await Users.findById(req.user.id);
    const other = await Users.findById(req.params.id);

    function compare(arr1, arr2) {
      const finalArray = [];
      arr1.forEach((e1) =>
        arr2.forEach((e2) => {
          if (e1.toString() === e2.toString()) {
            finalArray.push(e1);
          }
        })
      );
      return finalArray;
    }

    const mutualFriends = compare(me.friends, other.friends);

    return res.status(200).json({ status: 200, mutualFriends: mutualFriends });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updatePassword,
  updateMe,

  getByUserId,
  getAllUsers,

  updateUser,

  addFriends,
  getAllMutualFriends,
};
