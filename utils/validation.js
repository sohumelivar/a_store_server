const Joi = require('joi');

const registrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  secondPassword: Joi.string().valid(Joi.ref('password')).required(),
  firstname: Joi.string().max(100).allow(null, ''),
  lastname: Joi.string().max(100).allow(null, ''),
  age: Joi.number().integer().min(1).allow(null, ''),
  avatar: Joi.any().optional()
}).unknown(true);

module.exports = { registrationSchema };

