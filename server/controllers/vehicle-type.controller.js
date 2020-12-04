const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const vehicleType = require('../models/vehicle-type.model');

const vehicleTypeCreateSchema = Joi.object({
  vehicleTypeName: Joi.string().required().trim().lowercase(),
  isActive: Joi.bool().required()
})
const vehicleTypeUpdateSchema = Joi.object({
  vehicleTypeName: Joi.string().required().trim().lowercase(),
  isActive: Joi.bool().optional()
})


function verifyCreate(vehicleType) { return helper.validator(vehicleType, vehicleTypeCreateSchema) }
function verifyupdate(vehicleType) { return helper.validator(vehicleType, vehicleTypeUpdateSchema) }
module.exports = {
  verifyCreate,
  verifyupdate
}
