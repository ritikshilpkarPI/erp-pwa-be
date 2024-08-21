const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');
const Sale = require('../dbModels/sale.model');
const { uploadPdfToCloudinary } = require('../util/cloudinaryUtils');

// Function to ensure the invoices directory exists
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

const getSaleById = async (id) => {
    try {
        const sale = await Sale.findById(id);
        if (sale) {
            return sale;
        } else {
            console.log("Sale not found");
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching sale');
    }
};



  const whatsAppInvoice = async (req, res) => {
    try {
        const { id, countryCode, phoneNumber } = req.body;

        // Fetch sale details by ID
        const saleDetails = await getSaleById(id);
        if (!saleDetails) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        const { download_link } = saleDetails;  
        // Combine country code and phone number
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        // Create the WhatsApp message with the link
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${fullPhoneNumber}&text=Hello, here is your invoice: ${download_link}`;

        // Send the WhatsApp URL as JSON response
        res.json({ whatsappUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send invoice' });
    }
};

  
  

module.exports = {
    whatsAppInvoice,
};
