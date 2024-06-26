const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    business_name: { type: String, required: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
