const { boolean } = require('joi');
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true }
});


const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String, required: true, unique: true,
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "UserRole" },
  isActive: { type: Boolean, default: true }
}, {
  versionKey: false
});


module.exports = mongoose.model('User', UserSchema);
