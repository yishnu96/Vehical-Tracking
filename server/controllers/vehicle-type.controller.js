const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const vehicleType = require('../models/vehicle-type.model');

const vehicleTypeCreateSchema = Joi.object({
  vehicleName: Joi.string().required().trim().lowercase(),
  vehicleTypeName: Joi.string().required().trim().lowercase()
})
const vehicleTypeUpdateSchema = Joi.object({
  vehicleName: Joi.string().required().trim().lowercase(),
  vehicleTypeName: Joi.string().required().trim().lowercase()
})


function verifyCreate(vehicleType) { return helper.validator(vehicleType, vehicleTypeCreateSchema) }
function verifyupdate(vehicleType) { return helper.validator(vehicleType, vehicleTypeUpdateSchema) }
module.exports = {
  verifyCreate,
  verifyupdate
}
