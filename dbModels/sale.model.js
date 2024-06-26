const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    item_id: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date_of_sale: { type: Date, required: true },
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
});

module.exports = mongoose.model('Sale', SaleSchema);
