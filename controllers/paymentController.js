const Payment = require('../dbModels/payment.model');

// Get payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findById(id);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new payment
const createPayment = async (req, res) => {
    const { payment_date, payment_type, cheque_name, cheque_number, cheque_amount, cheque_date, sale_id } = req.body;
    try {
        const newPayment = new Payment({ payment_date, payment_type, cheque_name, cheque_number, cheque_amount, cheque_date, sale_id });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update payment by ID
const updatePaymentById = async (req, res) => {
    const { id } = req.params;
    const { payment_date, payment_type, cheque_name, cheque_number, cheque_amount, cheque_date, sale_id } = req.body;
    try {
        const payment = await Payment.findByIdAndUpdate(
            id,
            { payment_date, payment_type, cheque_name, cheque_number, cheque_amount, cheque_date, sale_id },
            { new: true }
        );
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete payment by ID
const deletePaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findByIdAndDelete(id);
        if (payment) {
            res.json({ message: 'Payment deleted' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getPaymentById,
getAllPayments,
createPayment,
updatePaymentById,
deletePaymentById,
}