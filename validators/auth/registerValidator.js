const joi = require("joi");

const validation = joi.object({
  name: joi.string().min(3).max(25).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
  gender: joi.string().valid("male", "female", "prefer not to say").required(),
});

const registerValidator = async (req, res, next) => {
  const { name, email, password, gender } = req.body;
  const payload = { name, email, password, gender };

  const { error } = validation.validate(payload);
  if (error) {
    return res.status(406).json({ status: 406, msg: error.message });
  } else {
    req.folderName = "User_Profile";
    next();
  }
};

module.exports = registerValidator;
