const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    sold_by: { type: String, enum: ['Unit', 'Dozen', 'Carton'], required: true },
    price_per_unit: { type: Number, required: true },
    price_per_dozen: { type: Number, required: true },
    price_per_carton: { type: Number, required: true },
});

module.exports = mongoose.model('Item', ItemSchema);
