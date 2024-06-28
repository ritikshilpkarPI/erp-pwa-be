const Item = require('../dbModels/item.model');

// Create a new item
const createItem = async (req, res) => {
    const { name, category_id, sold_by, price_per_unit, price_per_dozen, price_per_carton } = req.body;
    try {
        const newItem = new Item({ name, category_id, sold_by, price_per_unit, price_per_dozen, price_per_carton });
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
        let items;

        if (req.body.category_id) {
            items = await Item.find({ category_id: req.body.category_id });
        } else {
            items = await Item.find();
        }
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