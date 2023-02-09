const joi = require("joi");

const validation = joi.object({
  caption: joi.string().trim(true).required(),
  feeling: joi.string().trim(true).required(),
  author: joi.string().trim(true).required(),
});

const postValidator = async (req, res, next) => {
  const { caption, feeling, author } = req.body;

  const payload = { caption, feeling, author };

  const { error } = validation.validate(payload);
  if (error) {
    return res.status(406).json({ status: 406, msg: error.message });
  } else {
    req.folderName = `CookieBlog/Posts/${req.body.caption}`;
    next();
  }
};

module.exports = postValidator;
