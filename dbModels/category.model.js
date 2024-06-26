const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: { type: String },
});

module.exports = mongoose.model('Category', CategorySchema);
