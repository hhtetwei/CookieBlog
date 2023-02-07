const Users = require("./../models/userModel");

const getAllUsers = async (req, res, next) => {
  const users = await Users.find();
  if (!users) {
    res.status(404).json({
      status: 404,
      message: "Something went wrong",
    });
  } else {
    res.status(200).json({
      status: 200,
      users: users,
    });
  }
};
const createUsers = async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    // const newUser = await Users.create(user);
    res.status(200).json({
      status: 200,
      message: "New User created successfully!",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
module.exports = {
  getAllUsers,
  createUsers,
};
