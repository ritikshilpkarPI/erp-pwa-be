const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    payment_date: { type: Date, required: true },
    payment_type: { type: String, enum: ['Cash', 'Credit', 'Cheque'], required: true },
    cheque_name: { type: String },
    cheque_number: { type: String },
    cheque_amount: { type: Number },
    cheque_date: { type: Date },
    sale_id: { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
});

module.exports = mongoose.model('Payment', PaymentSchema);
