const Sale = require('../dbModels/sale.model');

// Get sale by ID
const getSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await Sale.findById(id);
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all sales
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new sale
const createSale = async (req, res) => {
    const { customer_id, items_id, employee_id, date_of_sale, payment_id } = req.body;
    try {
        const newSale = new Sale({ customer_id, items_id, employee_id, date_of_sale, payment_id });
        await newSale.save();
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update sale by ID
const updateSaleById = async (req, res) => {
    const { id } = req.params;
    const { customer_id, item_id, employee_id, date_of_sale, payment_id } = req.body;
    try {
        const sale = await Sale.findByIdAndUpdate(
            id,
            { customer_id, item_id, employee_id, date_of_sale, payment_id },
            { new: true }
        );
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete sale by ID
const deleteSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await Sale.findByIdAndDelete(id);
        if (sale) {
            res.json({ message: 'Sale deleted' });
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getSaleById,
getAllSales,
createSale,
updateSaleById,
deleteSaleById,
}