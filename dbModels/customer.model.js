const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: { type: String },
    address: { type: String },
    email: { type: String },
    id_number: { type: String },
    credit_limit: { type: Number },
    telephone: { type: String },
    is_deleted: { type: Boolean, default: false },

});

module.exports = mongoose.model('Customer', CustomerSchema);
