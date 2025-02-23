const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');
const Sale = require('../dbModels/sale.model');
const { uploadPdfToCloudinary } = require('../util/cloudinaryUtils');
const { v4: uuidv4 } = require('uuid');
const { jsPDF } = require('jspdf');
const { calculatePaidAmount } = require('../util/calculatePaidAmount');

// Get sale by ID
const getSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await Sale.findById(id);
        if (sale) {
            return res.json(sale);
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all sales
const getAllSales = async (req, res) => {
    try {
        const { _id: userId } = req.decodedUser;
        const sales = await Sale.find({ userId }).populate('customer_id','_id name');
        return res.json(sales);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const generatePDF = async (
    TXN_id,
    customer_id,
    items,
    employee_id,
    date_of_sale,
    payment_id,
    totalAmount
) => {

    const getCustomerById = async (id) => {
        try {
            const customer = await customerModel?.findById(id);
            return customer;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching customer');
        }
    };
    
    const getEmployeeById = async (id) => {
        try {
            const employee = await employeModel?.findById(id);
            return employee;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching employee');
        }
    };
    
    const getItemById = async (items) => {
        let totalQuantity = 0;
        try {
            const itemPromises = items?.map(async (item) => {
                const foundItem = await itemModel?.findById(item._id);
                if (!foundItem) {
                    throw new Error('Item not found');
                }
                totalQuantity += item?._count;
                return {
                    _name: foundItem?.name,
                    _prize: foundItem?.prize,
                    _count: item?._count,
                    _category: foundItem?.category,  // Ensure this field exists in your item model
                };
            });
    
            const resolvedItems = await Promise.all(itemPromises);
            return { resolvedItems, totalQuantity };
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching items');
        }
    };

    try {
        const customer = await getCustomerById(customer_id);
        const employee = await getEmployeeById(employee_id);
        const { resolvedItems, totalQuantity } = await getItemById(items);
        const dateOfSale = new Date(date_of_sale);
        const datePart = dateOfSale.toISOString().slice(0, 10);
        const timePart = dateOfSale.toISOString().slice(11, 19);

        const doc = new jsPDF();

        // Add content to PDF
        doc.setFontSize(10);
        doc.text(`${employee?.business_name?? "N/A"}`, 70, 20);
        doc.text(`${employee?.business_name?? "N/A"}, ${employee?.address}`, 70, 25);
        doc.text(`${employee?.name?? "N/A"}`, 70, 30);
        doc.text('BILL INVOICE', 80, 35);
        doc.text(`CUSTOMER NAME: ${customer?.name?? "N/A"}`, 10, 45);
        doc.text(`MOBILE NUMBER: ${customer?.telephone?? "N/A"}`, 10, 50);
        doc.text(`DELIVERY MODE: ${totalAmount?? "N/A"}`, 10, 55);
        doc.text(`DELIVERY ADDRESS: ${totalAmount?? "N/A"}`, 10, 60);
        doc.text(`PAYMENT MODE: ${totalAmount?? "N/A"}`, 130, 45);
        doc.text(`TOTAL ITEMS: ${resolvedItems?.length?? "N/A"}`, 130, 50);
        doc.text(`TOTAL QUANTITY: ${totalQuantity?? "N/A"}`, 130, 55);

        // Table header
        doc.setFontSize(10);
        doc.text('SR NO.', 10, 77);
        doc.text('NAME', 30, 77);
        doc.text('RATE (Rs.)', 100, 77);
        doc.text('CATEGORY', 65, 77);
        doc.text('QTY', 140, 77);
        doc.text('VALUE (Rs.)', 170, 77);

        let startY = 85;

        resolvedItems.forEach((item, index) => {
            doc.text(`${index + 1}`, 10, startY);
            doc.text(`${item?._name}`, 30, startY);
            doc.text(`${item?._category}`, 65, startY);
            doc.text(`${item?._prize}`, 100, startY);
            doc.text(`${item?._count}`, 140, startY);
            doc.text(`${item?._prize * item._count}`, 170, startY);
            startY += 10;
        });
        doc.text('SUB TOTAL:', 140, startY + 10);
        doc.text(`${totalAmount}`, 170, startY + 10);

        doc.text(`TXN NUMBER: ${TXN_id}`, 10, startY + 20);
        doc.text(`ORDER TIME: ${timePart}`, 10, startY + 30);
        doc.text(`ORDER DATE: ${datePart}`, 10, startY + 40);

        // Generate and return PDF as ArrayBuffer
        const pdfBuffer = doc.output('arraybuffer');
        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to generate invoice');
    }
};

// Create a new sale
const createSale = async (req, res) => {
    console.log(req.body);
    console.log(req.decodedUser);  
    const { customer_id, items, employee_id, date_of_sale, payment_id, totalAmount,cheques, cashAmount = 0 } = req.body;
    const { _id: userId } = req.decodedUser;

    // Ensure items is defined and is an array
    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'items must be an array' });
    }
    const paidAmount= calculatePaidAmount({cashAmount,cheques});

    // Format items to ensure each item has _id and _count properties
    const formattedItems = items.map(item => ({
        _id: item._id,
        _count: item._count,
        quantityType: item.quantityType,
        price: item.price
    }));

    const TXN_id = uuidv4();


    const pdfBuffer = await generatePDF(
        TXN_id,
        customer_id,
        items,
        employee_id,
        date_of_sale,
        payment_id,
        totalAmount
    );

    if (!pdfBuffer) {
        return res.status(400).json({ error: 'Failed to generate pdf' });
    }
    const uploadResult = await uploadPdfToCloudinary(pdfBuffer);
        if (!uploadResult) {
            return res.status(400).json({ error: 'Failed to generate link' });
        }


    try {
        const newSale = new Sale({ 
            TXN_id,
            customer_id, 
            items: formattedItems, 
            employee_id, 
            date_of_sale, 
            payment_id, 
            cheques,
            totalAmount: parseFloat(totalAmount), 
            download_link:uploadResult.secure_url,
            userId,
            remainingAmount: Number(totalAmount) - Number(paidAmount)
        });
        await newSale.save();
        console.log(newSale);        
        return res.status(201).json(newSale);

    } catch (error) {
        console.log(error);  
        return res.status(500).json({ message: error.message });
    }
};



// Update sale by ID
const updateSaleById = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log( req.body);    
    const { totalAmount, remainingAmount, cheques, cashAmount = 0 } = req.body;
    const paidAmount = calculatePaidAmount({ cashAmount, cheques });
    console.log(paidAmount);
    
    try {
        const sale = await Sale.findByIdAndUpdate(
            id,
            {
              $set: {
                remainingAmount:
                  Number(remainingAmount) - Number(paidAmount),
              },
              $push: { cheques: { $each: cheques } }, 
            },
            { new: true }
        );
        if (sale) {
            console.log(sale);            
            return res.json(sale);
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        console.log(error);  
        return res.status(500).json({ message: error.message });
    }
};

// Delete sale by ID
const deleteSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await Sale.findByIdAndDelete(id);
        if (sale) {
            return res.json({ message: 'Sale deleted' });
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getSaleById,
    getAllSales,
    createSale,
    updateSaleById,
    deleteSaleById,
}