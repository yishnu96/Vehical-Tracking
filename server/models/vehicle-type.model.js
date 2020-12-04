const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
    vehicleTypeName: { type: String, required: true, lowercase: true, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
}, {
    versionKey: false
});


module.exports = mongoose.model('VehicleType', VehicleTypeSchema);