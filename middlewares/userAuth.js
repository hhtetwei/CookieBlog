const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const userAuth = async function (req, res, next) {
  try {
    const access_token = req.header("Authorization");
    console.log(access_token);

    if (!access_token) {
      return res.status(400).json({
        status: false,
        msg: "Token expires or Token was not found! Please Login again!",
      });
    }

    jwt.verify(access_token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ status: false, msg: "error" });
      }
      req.user = user;
      next();
      // console.log(user);
    });
  } catch (err) {
    next(err);
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  userAuth,
};
