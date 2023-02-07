const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

//
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

// models
const Users = require("../models/userModel");

// helpers
const {
  createActivationToken,
  createAccessToken,
} = require("../utils/createTokens");
const { cookieOptions } = require("../utils/cookieOptions");
const { activateEmailHtml } = require("../helpers/activateEmailHtml");

// services
const { sendEmail } = require("../helpers/sendEmail");

// from dot env
const ACTIVATION_TOKEN_SECRET = process.env.ACTIVATION_TOKEN_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

// register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // unique validation
    const userEmail = await Users.findOne({ email });

    if (userEmail) {
      return res
        .status(400)
        .json({ status: 400, msg: "This email already exists!" });
    }

    // create user model
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      name,
      email,
      password: passwordHash,
    };

    // create email activation token & send email
    const activation_token = createActivationToken(newUser);

    const url = `${CLIENT_URL}/user/activate/${activation_token}`;
    const text = "Verify your email address";

    const html = activateEmailHtml(url, text);

    sendEmail(email, html);

    return res.status(200).json({
      status: 200,
      msg: "Register Success! Please activate your email to start",
    });
  } catch (err) {
    next(err);
  }
};

// activate email
const activateEmail = async (req, res, next) => {
  try {
    // check email activation token
    const { activation_token } = req.body;

    // verify token
    jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(400).json({ status: false, msg: err.message });
      }
      const { name, email, password } = user;

      // // unique validation
      const userEmail = await Users.findOne({ email });
      if (userEmail) {
        return res.status(400).json({
          status: 400,
          msg: "This email already exists!",
        });
      }

      //   // create custom id
      //   const id = await createCustomId(Users, "U");

      // create user model & save in mongodb
      if (id) {
        const newUser = new Users({
          id,
          name,
          email,
          password,
          pictureUrls: [
            "https://res.cloudinary.com/dm5vsvaq3/image/upload/v1673412749/PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
          ],
          picPublicIds: [
            "PharmacyDelivery/Users/default-profile-picture_nop9jb.webp",
          ],
        });

        const savedUser = await newUser.save();

        // create token & save in cookies
        const access_token = createAccessToken({
          id: savedUser._id,
        });
        res.cookie("access_token", access_token, cookieOptions);

        return res.status(201).json({
          status: 201,
          user: savedUser,
          msg: "Account has been created!",
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

// // login
// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // check email
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ status: 400, msg: "Wrong credentials!" });
//     }
//     // check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ status: 400, msg: "Wrong credentials!" });
//     }

//     // check if two factor or not
//     const { isTwoFactor, phoneNumber, _id } = user;
//     if (isTwoFactor) {
//       req.body = { ...req.body, isTwoFactor, phoneNumber, userId: _id };
//       next();
//       return;
//     }

//     // create token & save in cookies
//     const access_token = createAccessToken({ id: user._id });
//     res.cookie("access_token", access_token, cookieOptions);

//     return res.status(200).json({ status: 200, user, msg: "Login Success!" });
//   } catch (err) {
//     next(err);
//   }
// };

// // forgotPassword
// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ status: 400, msg: "This email does not exist!" });
//     }

//     // create token & send email
//     const activation_token = createActivationToken({ id: user._id });
//     const url = `${CLIENT_URL}/user/reset/${activation_token}`;

//     const text = "Reset your password";
//     const html = activateEmailHtml(url, text);

//     sendMail(email, html);

//     return res.status(200).json({
//       status: 200,
//       msg: "Already resend your password, please check your email !",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // reset password
// const resetPassword = async (req, res, next) => {
//   try {
//     const { password } = req.body;
//     const passwordHash = await bcrypt.hash(password, 12);

//     const user = await Users.findOneAndUpdate(
//       { _id: req.user.id },
//       {
//         password: passwordHash,
//       }
//     );
//     return res.status(200).json({
//       status: 200,
//       user,
//       msg: "Password is successfully changed!",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // logout
// const logout = async (req, res, next) => {
//   try {
//     res.clearCookie("access_token", { path: "/api" });
//     return res.status(200).json({ status: 200, msg: "Logged out!" });
//   } catch (err) {
//     next(err);
//   }
// };

// // 2 factor authentication
// const storeOtp = async (req, res, next) => {
//     try {
//         const { userId, phoneNumber, otp } = req.smsData;

//         const otpHash = await bcrypt.hash(otp, 12);

//         const newOtp = new Otps({
//             userId,
//             phoneNumber,
//             otp: otpHash,
//             createdAt: Date.now(),
//             expiresAt: Date.now() + 1000 * 60 * 5,
//         });
//         await newOtp.save();

//         return res.json({ status: true, otp, msg: "OTP is sent" });
//     } catch (err) {
//         next(err);
//         return res.status(500).json({ status: false, msg: err.message });
//     }
// };

// //
// const googleLogin = async (req, res, next) => {
//     try {
//         const { credential } = req.body;
//         const verify = await client.verifyIdToken({
//             idToken: credential,
//             audience: process.env.MAILING_SERVICE_CLIENT_ID,
//         });

//         const { email, email_verified, name, picture } = verify.payload;

//         const password = email + process.env.GOOGLE_SECRET;

//         const passwordHash = await bcrypt.hash(password, 12);

//         if (!email_verified) {
//             return res
//                 .status(400)
//                 .json({ status: 400, msg: "Email verfication failed!" });
//         }

//         //
//         const user = await Users.findOne({ email });

//         if (user) {
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return res
//                     .status(400)
//                     .json({ status: 400, msg: "Wrong credentials!" });
//             }

//             // create token & save in cookies
//             const access_token = createAccessToken({ id: user._id });
//             res.cookie("access_token", access_token, cookieOptions);

//             return res
//                 .status(200)
//                 .json({ status: 200, user, msg: "Login Success!" });
//         }
//         // create custom id
//         const id = await createCustomId(Users, "U");

//         if (id) {
//             const newUser = new Users({
//                 id,
//                 name,
//                 email,
//                 password: passwordHash,
//                 pictureUrls: [picture],
//             });
//             const savedUser = await newUser.save();

//             // create token & save in cookies
//             const access_token = createAccessToken({ id: savedUser._id });
//             res.cookie("access_token", access_token, cookieOptions);

//             return res
//                 .status(201)
//                 .json({
//                     status: 201,
//                     user: savedUser,
//                     msg: "Account has been created!",
//                 });
//         }
//     } catch (err) {
//         next(err);
//     }
// };

// const facebookLogin = async (req, res, next) => {
//     try {
//         const { accessToken, userID } = req.body;

//         const URL = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;

//         const data = await fetch(URL)
//             .then((res) => res.json())
//             .then((res) => {
//                 return res;
//             });

//         const { name, email, picture } = data;

//         const password = email + process.env.FACEBOOK_SECRET;

//         const passwordHash = await bcrypt.hash(password, 12);

//         //
//         const user = await Users.findOne({ email });

//         if (user) {
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return res
//                     .status(400)
//                     .json({ status: 400, msg: "Wrong credentials!" });
//             }

//             // create token & save in cookies
//             const access_token = createAccessToken({ id: user._id });
//             res.cookie("access_token", access_token, cookieOptions);

//             return res
//                 .status(200)
//                 .json({ status: 200, user, msg: "Login Success!" });
//         }
//         // create custom id
//         const id = await createCustomId(Users, "U");

//         if (id) {
//             const newUser = new Users({
//                 id,
//                 name,
//                 email,
//                 password: passwordHash,
//                 pictureUrls: picture.data.url,
//             });
//             const savedUser = await newUser.save();

//             // create token & save in cookies
//             const access_token = createAccessToken({ id: savedUser._id });
//             res.cookie("access_token", access_token, cookieOptions);

//             return res.status(201).json({
//                 status: 201,
//                 user: savedUser,
//                 msg: "Account has been created!",
//             });
//         }
//     } catch (err) {
//         next(err);
//     }
// };

module.exports = {
  register,
  activateEmail,

  // login,
  // forgotPassword,
  // resetPassword,

  // logout,
};
