const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
    vehicleName: { type: String, trim: true},
    vehicleTypeName: { type: String, required: true, lowercase: true, trim: true },
    createdAt: { type: Date, default: Date.now },
}, {
    versionKey: false
});


module.exports = mongoose.model('VehicleType', VehicleTypeSchema);
