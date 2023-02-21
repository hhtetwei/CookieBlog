const Users = require("../models/userModel");

const saveActiveTimestamp = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      userId = req.user.id;

      if (userId) {
        await Users.updateOne(
          { _id: userId },
          { $set: { lastActiveTimestamp: new Date() } }
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = saveActiveTimestamp;
