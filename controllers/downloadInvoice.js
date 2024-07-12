const { jsPDF } = require("jspdf");
const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');

const getCustomerById = async (id) => {
    try {
        const customer = await customerModel.findById(id);
        return customer ;
    } catch (error) {
        console.log(error);
    }
};

const getEmployeeById = async (id) => {
    try {
        const employee = await employeModel.findById(id);
        return employee;
    } catch (error) {
        console.log(error);
    }
};

const getItemById = async (items) => {
    try {

        const itemPromises = items.map(async (item) => {
            const foundItem = await itemModel.findById(item._id);

            return {
                _name: foundItem.name,
                _prize: foundItem.prize,
                _count: item._count,
            };
        });

        const resolvedItems = await Promise.all(itemPromises);

        return resolvedItems;
    } catch (error) {
        console.log(error);
    }
};

exports.downloadInvoice = async (req, res, next) => {

    const {
        _id,
        customer_id,
        items,
        employee_id,
        date_of_sale,
        payment_id,
        totalAmount
    } = req.body;

    const customer = await getCustomerById(customer_id);
    const employee = await getEmployeeById(employee_id);
    const formattedItems = await getItemById(items);
    const dateOfSale = new Date(date_of_sale);
    const datePart = dateOfSale.toISOString().slice(0, 10);
    const timePart = dateOfSale.toISOString().slice(11, 19);

    const doc = new jsPDF();  


    // Add header text
    doc.setFontSize(10);
    doc.text('Avenue E-Commerce Limited', 70, 20);
    doc.text('Avenue E-Commerce Ltd. Survey No. 6, Hissa No. 15, Barave Village Near Godrej Hill,', 70, 25);
    doc.text('Khadakpada, Kalyan West, Thane Maharashtra -421301', 70, 30);
    doc.text('BILL INVOICE', 80, 35);
    doc.text(`CUSTOMER NAME: ${customer.name}`, 10, 45);
    doc.text(`MOBILE NUMBER: ${customer.telephone}`, 10, 50);
    doc.text(`DELIVERY MODE: ${totalAmount}`, 10, 55);
    doc.text(`DELIVERY ADDRESS: ${totalAmount}`, 10, 60);
    doc.text(`PAYMENT MODE: ${totalAmount}`, 130, 45);
    doc.text(`TOTAL ITEMS: ${formattedItems.length}`, 130, 50);
    doc.text(`TOTAL QUANTITY:`, 130, 55);

    // Table header
    doc.setFontSize(10);
    doc.text('SR NO.', 10, 77);
    doc.text('NAME', 30, 77);
    doc.text('RATE (Rs.)', 100, 77);
    doc.text('CATEGORY', 65, 77);
    doc.text('QTY', 140, 77);
    doc.text('VALUE (Rs.)', 170, 77);

    // Add table content dynamically

    let startY = 85;

    formattedItems.forEach((item, index) => {
        let a = 0;
        a += item._count;
        doc.text(`${index + 1}`, 10, startY);
        doc.text(`${item._name}`, 30, startY);
        doc.text(`${item._category}`, 65, startY);
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

    // Set the response headers
    res.setHeader('Content-disposition', 'attachment; filename=invoice.pdf');
    res.setHeader('Content-type', 'application/pdf');

    // Send the PDF buffer as the response
    const pdfBuffer = doc.output('arraybuffer');
    res.send(Buffer.from(pdfBuffer));
};