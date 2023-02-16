const { ObjectId } = require("mongoose").Schema.Types;
const Posts = require("../models/postModel");

const getNewsFeed = async (req, res, next) => {
  try {
    const requestedBy = req.user.id;
    const { limit = 10, skip = 0 } = req.query;

    const unSeenPosts = await Posts.find({ seenUsers: { $ne: requestedBy } })
      .limit(+limit)
      .skip(+skip);

    for (const post of unSeenPosts) {
      post.seenUsers.push(requestedBy);
      await post.save();
    }

    //   await Promise.all(
    //     unSeenPosts.map((post) => {
    //       post.updateOne({}, { seenUsers: { $push: requestedBy } });
    //     })
    //   );

    return res.json(unSeenPosts);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getNewsFeed };
