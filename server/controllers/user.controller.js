const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const User = require('../models/user.model');

const userCreateSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const userUpdateSchema = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().optional()
})

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required()
})

const userRegisterSchema = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
})

function verifyCreate(user) { return helper.validator(user, userCreateSchema) }
function verifyupdate(user) { return helper.validator(user, userUpdateSchema) }
function verifyLogin(user) { return helper.validator(user, userLoginSchema) }
function verifyRegister(user) { return helper.validator(user, userRegisterSchema) }

module.exports = { verifyCreate, verifyupdate, verifyLogin, verifyRegister }
