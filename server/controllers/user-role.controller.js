const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const roleType = require('../models/user-role.model');

const roleTypeCreateSchema = Joi.object({
  roleName: Joi.string().required().trim().lowercase(),
  isActive: Joi.bool().required().default(true)
})
const roleTypeUpdateSchema = Joi.object({
  roleName: Joi.string().required().trim().lowercase(),
  isActive: Joi.bool().optional()
})


function verifyCreate(roleType) { return helper.validator(roleType, roleTypeCreateSchema) }
function verifyupdate(roleType) { return helper.validator(roleType, roleTypeUpdateSchema) }
module.exports = { verifyCreate, verifyupdate }
