const { jsPDF } = require("jspdf");
const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');
const { sendPDFtomail } = require("../util/sendEmail");

const getCustomerById = async (id) => {
    try {
        const customer = await customerModel.findById(id);
        return customer;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching customer');
    }
};

const getEmployeeById = async (id) => {
    try {
        const employee = await employeModel.findById(id);
        return employee;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching employee');
    }
};

const getItemById = async (items) => {
    let totalQuantity = 0;
    try {
        const itemPromises = items.map(async (item) => {
            const foundItem = await itemModel.findById(item._id);
            if (!foundItem) {
                throw new Error('Item not found');
            }
            totalQuantity += item._count;
            return {
                _name: foundItem.name,
                _prize: foundItem.prize,
                _count: item._count,
                _category: foundItem.category,  // Ensure this field exists in your item model
            };
        });

        const resolvedItems = await Promise.all(itemPromises);
        return { resolvedItems, totalQuantity };
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching items');
    }
};

exports.emailInvoice = async (req, res) => {
    try {
        const {
            _id,
            customer_id,
            items,
            employee_id,
            date_of_sale,
            payment_id,
            totalAmount
        } = req.body;
        const { email } = req.query;

        const customer = await getCustomerById(customer_id);
        const employee = await getEmployeeById(employee_id);
        const { resolvedItems, totalQuantity } = await getItemById(items);
        const dateOfSale = new Date(date_of_sale);
        const datePart = dateOfSale.toISOString().slice(0, 10);
        const timePart = dateOfSale.toISOString().slice(11, 19);

        const doc = new jsPDF();

        // Add content to PDF
        doc.setFontSize(10);
        doc.text(`${employee.business_name}`, 70, 20);
        doc.text(`${employee.business_name}, ${employee.address}`, 70, 25);
        doc.text(`${employee.name}`, 70, 30);
        doc.text('BILL INVOICE', 80, 35);
        doc.text(`CUSTOMER NAME: ${customer.name}`, 10, 45);
        doc.text(`MOBILE NUMBER: ${customer.telephone}`, 10, 50);
        doc.text(`DELIVERY MODE: ${totalAmount}`, 10, 55);
        doc.text(`DELIVERY ADDRESS: ${totalAmount}`, 10, 60);
        doc.text(`PAYMENT MODE: ${totalAmount}`, 130, 45);
        doc.text(`TOTAL ITEMS: ${resolvedItems.length}`, 130, 50);
        doc.text(`TOTAL QUANTITY: ${totalQuantity}`, 130, 55);

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
            doc.text(`${item._name}`, 30, startY);
            doc.text(`${item._category}`, 65, startY);  // Ensure this field exists in your item model
            doc.text(`${item._prize}`, 100, startY);
            doc.text(`${item._count}`, 140, startY);
            doc.text(`${item._prize * item._count}`, 170, startY);
            startY += 10;
        });
        doc.text('SUB TOTAL:', 140, startY + 10);
        doc.text(`${totalAmount}`, 170, startY + 10);

        doc.text(`TXN NUMBER: ${_id}`, 10, startY + 20);
        doc.text(`ORDER TIME: ${timePart}`, 10, startY + 30);
        doc.text(`ORDER DATE: ${datePart}`, 10, startY + 40);

        // Send the PDF buffer as the response
        const pdfBuffer = doc.output('arraybuffer');
        await sendPDFtomail(email, `If you have any questions or need further assistance, please feel free to reach out to our customer support team at support@invoicify.com.

Thank you once again for choosing Invoicify. We look forward to serving you again soon.

Best regards,

The Invoicify Team`, "Thank you for shopping with Invoicify! We appreciate your business and hope you enjoy your purchase.", Buffer.from(pdfBuffer));
        console.log("Email sent successfully");

        return res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to send email' });
    }
};
