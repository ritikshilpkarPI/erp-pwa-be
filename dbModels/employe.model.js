const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String },
    username: { type: String },
    business_name: { type: String },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
