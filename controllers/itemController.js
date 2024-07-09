const { default: mongoose } = require('mongoose');
const cloudinaryImage = require('../util/cloudinaryUtils');
const Item = require('../dbModels/item.model');

// Create a new item
const createItem = async (req, res) => {
    const { img_url } = req.files;
    const { name, prize, category_id, sold_by, category, price_per_unit, price_per_dozen, price_per_carton, sku, barcode } = req.body;
    try {
        const result = await cloudinaryImage(img_url);
        const category_uid = new mongoose.Types.ObjectId().toString();
        const newItem = new Item({ name, prize, category_id: category_uid, sold_by, img_url: result.secure_url, category, price_per_unit, price_per_dozen, price_per_carton, sku, barcode });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get item by ID
const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all items
const getAllItems = async (req, res) => {
    try {
        const { category_id, search_query } = req.query;

        const query = {};

        if (category_id) {
            query.category_id = category_id;

        }
        if (search_query) {
            query.name = { $regex: search_query, $options: 'i' };

        }
        console.log(query)
        const items = await Item.find(query);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item by ID
const updateItemById = async (req, res) => {
    const { id } = req.params;
    const { name, category_id, sold_by, price_per_unit, price_per_dozen, price_per_carton } = req.body;
    try {
        const item = await Item.findByIdAndUpdate(
            id,
            { name, category_id, sold_by, price_per_unit, price_per_dozen, price_per_carton },
            { new: true }
        );
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete item by ID
const deleteItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndDelete(id);
        if (item) {
            res.json({ message: 'Item deleted' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createItem,
    getItemById,
    getAllItems,
    updateItemById,
    deleteItemById,
}