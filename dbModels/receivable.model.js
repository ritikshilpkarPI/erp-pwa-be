const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceivableSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount_owed: { type: Number, required: true },
    due_date: { type: Date, required: true },
    status: { type: String, enum: ['Open', 'Closed'], required: true },
});

module.exports = mongoose.model('Receivable', ReceivableSchema);
