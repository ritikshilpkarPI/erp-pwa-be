const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: { type: String },
    category_color:{type: String},
    category_image:{type: String},
    userId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Category', CategorySchema);
