const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fuelType: { type: mongoose.Schema.Types.ObjectId, ref: "FuelType", required: true },
  vehicleNumber: { type: String, required: true, lowercase: true, trim: true },
  vehicleType: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleType", required: true },
  isActive: { type: Boolean, required: true, default: true },
  latitude: { type: String },
  longitutde: { type: String },
}, {
  versionKey: false
});


module.exports = mongoose.model('Vehicle', VehicleSchema);