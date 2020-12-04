const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const fuelType = require('../models/fuel-type.model');

const fuelTypeCreateSchema = Joi.object({
  fuelTypeName: Joi.string().required().trim().lowercase(),
  isActive: Joi.bool().required().default(true)
})
const fuelTypeUpdateSchema = Joi.object({
  fuelTypeName: Joi.string().required().trim().lowercase(),
  isActive:Joi.bool().optional()
})


function verifyCreate(fuel) { return helper.validator(fuel, fuelTypeCreateSchema) }
function verifyupdate(fuel) { return helper.validator(fuel, fuelTypeUpdateSchema) }
module.exports = {
  verifyCreate,
  verifyupdate
}


