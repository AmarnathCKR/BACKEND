const Joi = require('joi');

const schema = Joi.object({
  title: Joi.string().required(),
  genre: Joi.string().required(),
  director: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2023).required(),
  actors: Joi.string().required(),
  plot: Joi.string().required(),
  runtime: Joi.number().integer().min(0).max(1000).required(),
  image: Joi.string().uri().required(),
  language: Joi.string().required(),
  country: Joi.string().required(),
  id: Joi.string()
});

const validateMovie = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details.map((detail) => detail.message).join(', ') });
  }

  next();
};

module.exports = validateMovie;
