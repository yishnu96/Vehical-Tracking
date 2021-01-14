const Joi = require('joi');
const helper = require('../utils/helper');

const locationSchema = Joi.object({
  vehicle: Joi.string().required(),
  coordinates: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  })

})


function verifyLocation(area) { return helper.validator(area, locationSchema) }


module.exports = {
  verifyLocation
}
