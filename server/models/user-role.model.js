const { bool, boolean } = require('joi');
const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
    roleName: { type: String, required: true, lowercase: true, trim: true },
    isActive: { type: Boolean, required: false, default: true },
    createdAt: { type: Date, default: Date.now },
}, {
    versionKey: false
});


module.exports = mongoose.model('UserRole', UserRoleSchema);