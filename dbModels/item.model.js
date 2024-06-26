const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    sold_by: { type: String, enum: ['Unit', 'Dozen', 'Carton'] },
    price_per_unit: { type: Number },
    price_per_dozen: { type: Number },
    price_per_carton: { type: Number },
});

module.exports = mongoose.model('Item', ItemSchema);
