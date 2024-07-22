const Customer = require('../dbModels/customer.model');

// Create a new customer
const createCustomer = async (req, res) => {
    const { name, address, id_number, email, credit_limit, telephone } = req.body;
    try {
        const newCustomer = new Customer({ name, address, id_number, email, credit_limit, telephone });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ is_deleted: false });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update customer by ID
const updateCustomerById = async (req, res) => {
    const { id } = req.params;
    const { name, address, id_number, credit_limit, telephone } = req.body;
    try {
        const customer = await Customer.findByIdAndUpdate(
            id,
            { name, address, id_number, credit_limit, telephone },
            { new: true }
        );
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft delete customer by ID
const softDeleteCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );
        if (customer) {
            res.json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change credit limit by customer ID
const changeCreditLimitByCustomerId = async (req, res) => {
    const { id } = req.params;
    const { credit_limit } = req.body;
    try {
        const customer = await Customer.findByIdAndUpdate(
            id,
            { credit_limit },
            { new: true }
        );
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createCustomer,
    getCustomerById,
    getAllCustomers,
    updateCustomerById,
    softDeleteCustomerById,
    changeCreditLimitByCustomerId
}