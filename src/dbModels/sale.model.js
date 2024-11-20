const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Item' },
  _count: { type: Number, default: 1 }
});
const chequeList = new Schema({
  bank_name:{type:String},
  check_number:{type:Number}, 
  amount:{type:Number}, 
  date:{type:Date}
})
const SaleSchema = new Schema({
  TXN_id: {type:String},
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [ItemSchema],
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
  date_of_sale: { type: Date },
  payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
  totalAmount: { type: Number, default: 0 },
  cheques:[chequeList],
  download_link:{type:String},
  userId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Sale', SaleSchema);
