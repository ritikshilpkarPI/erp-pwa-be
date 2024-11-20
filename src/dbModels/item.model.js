const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String },
    prize: { type: Number },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    sold_by: { type: String, enum: ['Unit', 'Dozen', 'Carton'] },
    img_url: { type: String },
    category: { type: String },
    price_per_unit: { type: Number },
    price_per_dozen: { type: Number },
    price_per_carton: { type: Number },
    sku: { type: Number },
    barcode: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Item', ItemSchema);
