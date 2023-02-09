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
// const Users = require('./../models/userModel')

const createPosts = async (req, res, next) => {
  try {
    let pictureUrls;
    let picPublicIds;
    const { caption, feeling, taggedUsers, author } = req.body;

    if (req.files.pictures && req.files.pictures.length) {
      const images = await uploadImages(req.files, req.folderName);

      pictureUrls = images.map((image) => image.secure_url);
      picPublicIds = images.map((image) => image.public_id);
    }

    const result = await Posts.create({
      author,
      caption,
      feeling,
      taggedUsers,
      pictureUrls,
      picPublicIds,
    });

    //   const newResult = new Posts({
    //     author,
    //     caption,
    //     feeling,
    //     taggedUsers,
    //     pictureUrls,
    //     picPublicIds,
    //   });

    //   const result = await newResult.save();

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
// try {
//   const { caption, feeling, taggedUsers, author } = req.body;
//   // create custom id
//   const id = await createCustomId(Posts, "P");

//   // store new medicine in mongodb
//   const storenewPost = async (pictureUrls, picPublicIds) => {
//     if (id) {
//       const newPost = new Posts({
//         id,
//         caption,
//         feeling,
//         taggedUsers,
//         author,
//         pictureUrls,
//         picPublicIds,
//       });

//       const savedPost = await newPost.save();

//       return res.status(201).json({
//         status: 201,
//         postId: savedPost._id,
//         msg: "New Post has been successfully uploaded!",
//       });
//     }
//   };

//     // handle images
//     const pictureUrls = [];
//     const picPublicIds = [];

//     const uploadPromises = uploadImages(req.files, req.folderName);

//     Promise.all(uploadPromises)
//       .then(async (pictures) => {
//         for (let i = 0; i < pictures.length; i++) {
//           const { secure_url, public_id } = pictures[i];
//           pictureUrls.push(secure_url);
//           picPublicIds.push(public_id);
//         }

//         await storenewPost(pictureUrls, picPublicIds);
//       })
//       .catch((err) => next(err));
//   } catch (err) {
//     next(err);
//   }
// };
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

    const matchStage = {
      $or: [{ feeling: { $regex: feeling } }],
    };

    const limitStage = limit * 1;
    const skipStage = (page - 1) * limit;

    const posts = await Posts.aggregate([
      { $match: matchStage },
      { $sort: { id: -1 } },
      { $skip: skipStage },
      { $limit: limitStage },
    ]);

    return res.status(200).json({ status: 200, posts });
  } catch (err) {
    next(err);
  }
};
const getPostById = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);

    return res.status(200).json({ status: 200, post });
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
};
