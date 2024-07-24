const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    phone_number: { type: Number },
    address: { type: String },
    business_name: { type: String }

});

module.exports = mongoose.model('Employee', EmployeeSchema);
