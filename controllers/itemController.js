const { default: mongoose } = require('mongoose');
const { uploadImageToCloudinary } = require('../util/cloudinaryUtils');
const Item = require('../dbModels/item.model');

// Create a new item
const createItem = async (req, res) => {
    const { img_url } = req.files;
    const { name, prize, category_id, sold_by, category, price_per_unit, price_per_dozen, price_per_carton, sku, barcode } = req.body;
    try {
        const result = await uploadImageToCloudinary(img_url);
        const newItem = new Item({ name, prize, category_id, sold_by, img_url: result.secure_url, category, price_per_unit, price_per_dozen, price_per_carton, sku, barcode });
        await newItem.save();
        return res.status(201).json(newItem);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get item by ID
const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (item) {
            return res.json(item);
        } else {
            return res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get all items
const getAllItems = async (req, res) => {
    try {
        const { category_id, name } = req.query;
        const query = {};

        if (category_id) {
            query.category_id = category_id;
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const items = await Item.find(query);

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }

        return res.json(items);

    } catch (error) {
        return res.status(400).json({ message: error.message });
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
            return res.json(item);
        } else {
            return res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete item by ID
const deleteItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndDelete(id);
        if (item) {
            return res.json({ message: 'Item deleted' });
        } else {
            return res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createItem,
    getItemById,
    getAllItems,
    updateItemById,
    deleteItemById,
}