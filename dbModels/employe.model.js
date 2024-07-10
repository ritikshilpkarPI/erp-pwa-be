const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    otp: { type: String },
    otpExpires: { type: Date }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
