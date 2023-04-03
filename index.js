require("dotenv").config();
require("./db/connect");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const app = express();
const saveActiveTimestamp = require("./middlewares/saveActiveTimestamp");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true })); //for creating data in request body json
app.use(cors());
app.use(cookieParser());
app.use(saveActiveTimestamp);

//routes
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const userRoute = require("./routes/userRoute");
const friRequestRoute = require("./routes/friRequestRoute");
const newsfeedRoute = require("./routes/newsFeedRoute");
const shareRoute = require("./routes/sharedRoute");
const { userAuth } = require("./middlewares/userAuth");

// app.use("/api/activeNow", userAuth, activeRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userAuth, userRoute);
app.use("/api/posts", userAuth, saveActiveTimestamp, postRoute);
app.use("/api/comments", userAuth, saveActiveTimestamp, commentRoute);
app.use("/api/friendRequests", userAuth, saveActiveTimestamp, friRequestRoute);
app.use("/api/newsfeed", userAuth, saveActiveTimestamp, newsfeedRoute);
app.use("/api/share", userAuth, saveActiveTimestamp, shareRoute);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
// handle errors
app.use(morgan("dev"));
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  // console.log(error);
  res.json({
    error: {
      message: error.message,
    },
  });
});
