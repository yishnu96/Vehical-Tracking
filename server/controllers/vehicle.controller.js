const bcrypt = require('bcrypt');
const Joi = require('joi');
const helper = require('../utils/helper');
const vehicle = require('../models/vehicle.model');

const vehicleCreateSchema = Joi.object({
  vehicleNumber: Joi.string().required().trim().lowercase(),
  driver: Joi.string().required().trim().lowercase(),
  fuelType: Joi.string().required().trim().lowercase(),
  vehicleType: Joi.string().required().trim().lowercase(),
})

const vehicleUpdateSchema = Joi.object({
  vehicleNumber: Joi.string().optional().trim().lowercase(),
  driver: Joi.string().optional().trim().lowercase(),
  fuelType: Joi.string().optional().trim().lowercase(),
  vehicleType: Joi.string().optional().trim().lowercase()
})


function verifyCreate(vehicle) { return helper.validator(vehicle, vehicleCreateSchema) }
function verifyupdate(vehicle) { return helper.validator(vehicle, vehicleUpdateSchema) }

module.exports = { verifyCreate, verifyupdate }
