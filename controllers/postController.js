const cloudinary = require("cloudinary");
const { createCustomId } = require("../services/createCustomId");
const { uploadImages } = require("../services/uploadImages");
const { deleteImages } = require("./../services/deleteImages");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const Posts = require("./../models/postModel");
const Share = require("./../models/sharedModel");
const User = require("./../models/userModel");
// const Users = require('./../models/userModel')

const createPosts = async (req, res, next) => {
  try {
    const { caption, author } = req.body;

    // store new medicine in mongodb
    const storenewPost = async (pictureUrls, picPublicIds) => {
      const newPost = new Posts({
        caption,
        author,
        pictureUrls,
        picPublicIds,
      });

      const savedPost = await newPost.save();

      return res.status(201).json({
        status: 201,
        postId: savedPost._id,
        msg: "New Post has been successfully uploaded!",
      });
    };

    // handle images
    const pictureUrls = [];
    const picPublicIds = [];

    const uploadPromises = uploadImages(req.files, req.folderName);

    Promise.all(uploadPromises)
      .then(async (pictures) => {
        for (let i = 0; i < pictures.length; i++) {
          const { secure_url, public_id } = pictures[i];
          pictureUrls.push(secure_url);
          picPublicIds.push(public_id);
        }

        await storenewPost(pictureUrls, picPublicIds);
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};
const updatePost = async (req, res, next) => {
  try {
    const { caption, feeling, taggedUsers } = req.body;
    // empty validation

    const post = await Posts.findById(req.params.id);

    let deletePromises = [];

    let oldPicPublicIds = post.picPublicIds;
    let oldPictureUrls = post.pictureUrls;

    // already exist photo in database
    if (oldPicPublicIds[0] !== "" && oldPictureUrls[0] !== "") {
      // delete old picture from cloudinary
      deletePromises = deleteImages(oldPicPublicIds);

      oldPicPublicIds = [""];
      oldPictureUrls = [""];
    }

    const uploadPromises = uploadImages(req.files, req.folderName);

    const updatePosts = async (postId, payload) => {
      await Posts.findByIdAndUpdate(postId, payload);
      return res
        .status(200)
        .json({ status: 200, msg: "Your Post has been successfully updated!" });
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

        await updatePosts(req.params.id, {
          caption,
          feeling,
          taggedUsers,
          pictureUrls,
          picPublicIds,
        });
      });
  } catch (err) {
    next(err);
  }
};
// delete
const deletePost = async (req, res, next) => {
  try {
    const { picPublicIds } = await Posts.findById(req.params.id);

    const deletePost = async (postId) => {
      await Posts.findByIdAndDelete(postId);
      return res
        .status(200)
        .json({ status: 200, msg: "Your Post has been successfully deleted!" });
    };

    // not include photo
    if (picPublicIds[0] === "") {
      await deletePost(req.params.id);
    }

    // include photo
    const deletePromises = deleteImages(picPublicIds);
    Promise.all(deletePromises)
      .then(async () => {
        await deletePost(req.params.id);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, feeling = "" } = req.query;

    // const sharePosts = await Share.find().populate("postId");
    const posts = await Posts.find()
      .populate("author")
      .select("-author.password")
      // .populate({
      //   path: "comments.commentedUser",
      //   select: "name",
      // })

      .sort("-createdAt ");

    // const allPosts = [...posts, ...sharePosts];
    return res.status(200).json({ status: 200, posts });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id).populate({
      path: "comments.commentedUser",
      select: "name",
    });

    return res.status(200).json({ status: 200, post });
  } catch (err) {
    next(err);
  }
};

// const savePosts = async (req, res, next) => {
//   try {
//     const { isSaved } = await Posts.find(req.body);

//     if (isSaved) {
//       res.status(200).json({
//         status: true,
//         message: "This post is already saved!",
//       });
//     }
//     await Posts.findByIdAndUpdate(req.params.id, {
//       isSaved: true,
//     });
//     res.status(200).json({
//       status: true,
//       message: "Successfully saved!",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const clickLike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const post = await Posts.findById(req.params.id);
    const isliked = post.likes.includes(userId);

    if (isliked) {
      await Posts.updateOne(
        { _id: req.params.id },
        { $pull: { likes: userId } }
      );
      return res.status(200).json({
        status: 200,
        message: "You have disliked this post",
      });
    } else {
      await Posts.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: userId },
        }
      );
      return res.status(200).json({
        status: true,
        message: "You liked this post",
      });
    }
  } catch (err) {
    next(err);
  }
};

const save = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Posts.findById(req.params.id);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { savedPosts: req.params.id },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      savePosts: user.savedPosts,
      message: "You have successfully saved this post!",
    });
  } catch (err) {
    next(err);
  }
};

const unsaved = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Posts.findById(req.params.id);

    await User.findByIdAndUpdate(userId, {
      $pull: { savedPosts: req.params.id },
    });

    return res.status(200).json({
      status: true,
      message: "You removed this post from your save posts",
    });
  } catch (err) {
    next(err);
  }
};

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { userId } = req.user;
    const { liked } = req.body;
    console.log(liked);
    const result = await Posts.updateOne(
      { _id: postId },
      { [liked ? "$addToSet" : "$pull"]: { likes: userId } }
    );
    res.status(200).json({
      status: true,
      message: "You have liked this post",
    });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find({ author: req.user.id }).populate("author");
    return res.status(200).json({ status: 200, posts });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPosts,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  save,
  clickLike,
  unsaved,
  likePost,

  getMyPosts,
};
