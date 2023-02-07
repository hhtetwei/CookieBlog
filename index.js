require("dotenv").config();
require("./db/connect");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const app = express();

app.use(express.json({ limit: "10mb" })); //for creating data in request body json
app.use(cors());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
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
  res.json({
    error: {
      message: error.message,
    },
  });
});
