const joi = require("joi");

const validation = joi.object({
  comments: joi.string().trim(true).required(),
});

const postValidator = async (req, res, next) => {
  const { comments } = req.body;

  const payload = { comments };

  const { error } = validation.validate(payload);
  if (error) {
    return res.status(406).json({ status: 406, msg: error.message });
  }
};

module.exports = postValidator;
