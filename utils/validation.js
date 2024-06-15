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

const addItemSchema = Joi.object({
  itemName: Joi.string().required().messages({
      'string.empty': 'Item name is required'
  }),
  category: Joi.string().required().messages({
      'string.empty': 'Category is required'
  }),
  description: Joi.string().required().messages({
      'string.empty': 'Description is required'
  }),
  price: Joi.number().required().messages({
      'number.base': 'Price must be a number',
      'any.required': 'Price is required'
  }),
  userId: Joi.number().required().messages({
      'number.base': 'User ID must be a number',
      'any.required': 'User ID is required'
  })
});

module.exports = { 
  registrationSchema, 
  addItemSchema 
};

