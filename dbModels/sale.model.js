const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Item' },
  _count: { type: Number, default: 1 }
});

const SaleSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [ItemSchema],
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
  date_of_sale: { type: Date },
  payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
  totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Sale', SaleSchema);
