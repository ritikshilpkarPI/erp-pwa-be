const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    id_number: { type: String, required: true },
    credit_limit: { type: Number, required: true },
    telephone: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Customer', CustomerSchema);
