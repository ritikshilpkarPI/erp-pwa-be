const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceivableSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
    amount_owed: { type: Number },
    due_date: { type: Date },
    status: { type: String, enum: ['Open', 'Closed'] },
    userId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Receivable', ReceivableSchema);
