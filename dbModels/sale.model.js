const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items_id: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
    date_of_sale: { type: Date },
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
    totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Sale', SaleSchema);
