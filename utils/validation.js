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

const editItemSchema = Joi.object({
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
  }), 
  deletedPhotos: Joi.array().items(Joi.string()).default([]).messages({
    'array.base': 'Deleted photos must be an array',
    'string.base': 'Each photo must be a string'
  }),
});

const profileSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  firstname: Joi.string().required().messages({
    'string.empty': 'First name is required',
  }),
  lastname: Joi.string().required().messages({
    'string.empty': 'Last name is required',
  }),
  age: Joi.number().required().messages({
    'number.base': 'Age must be a number',
    'any.required': 'Age is required',
  }),
  avatar: Joi.string().allow(null, ''), // Аватар может быть пустым или null
});


module.exports = { 
  registrationSchema, 
  addItemSchema,
  editItemSchema,
  profileSchema,
};

