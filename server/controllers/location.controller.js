const Joi = require('joi');
const helper = require('../utils/helper');

const locationSchema = Joi.object({
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
})

module.exports = {
    verifyLocation
}

function verifyLocation(area) { return helper.validator(area, locationSchema) }

