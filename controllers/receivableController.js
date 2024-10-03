const Receivable = require('../dbModels/receivable.model');

// Create a new receivable
const createReceivable = async (req, res) => {
    const { customer_id, amount_owed, due_date, status } = req.body;
    try {
        const newReceivable = new Receivable({ customer_id, amount_owed, due_date, status });
        await newReceivable.save();
        return res.status(201).json(newReceivable);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get receivable by ID
const getReceivableById = async (req, res) => {
    const { id } = req.params;
    try {
        const receivable = await Receivable.findById(id);
        if (receivable) {
            return res.json(receivable);
        } else {
            return res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all receivables
const getAllReceivables = async (req, res) => {
    try {
        const receivables = await Receivable.find();
        return res.json(receivables);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update receivable by ID
const updateReceivableById = async (req, res) => {
    const { id } = req.params;
    const { customer_id, amount_owed, due_date, status } = req.body;
    try {
        const receivable = await Receivable.findByIdAndUpdate(
            id,
            { customer_id, amount_owed, due_date, status },
            { new: true }
        );
        if (receivable) {
            return res.json(receivable);
        } else {
            return res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete receivable by ID
const deleteReceivableById = async (req, res) => {
    const { id } = req.params;
    try {
        const receivable = await Receivable.findByIdAndDelete(id);
        if (receivable) {
            return res.json({ message: 'Receivable deleted' });
        } else {
            return res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReceivable,
getReceivableById,
getAllReceivables,
updateReceivableById,
deleteReceivableById,
}