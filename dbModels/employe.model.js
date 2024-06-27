const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
