const Sale = require('../dbModels/sale.model');
const customerModel = require('../dbModels/customer.model');  // Make sure these models are required
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');

const getSaleById = async (id) => {

    try {
        const sale = await Sale.findById(id);
        if (sale) {
            return sale;
        } else {
            console.log("Sale not found");
            throw new Error("Sale not found");
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching sale');
    }
};

const getCustomerById = async (id) => {
    try {
        const customer = await customerModel.findById(id);
        if (customer) {
            return customer;
        } else {
            console.log("Customer not found");
            throw new Error("Customer not found");
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching customer');
    }
};

const getEmployeeById = async (id) => {
    try {
        const employee = await employeModel.findById(id);
        if (employee) {
            return employee;
        } else {
            console.log("Employee not found");
            throw new Error("Employee not found");
        }
    } catch (error) {
        console.log(error);
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
                _category: foundItem.category,
            };
        });

        const resolvedItems = await Promise.all(itemPromises);
        return { resolvedItems, totalQuantity };
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching items');
    }
};

const shareInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await getSaleById(id);
        const { items, totalAmount, customer_id, employee_id, date_of_sale } = sale;

        const customer = await getCustomerById(customer_id);
        const employee = await getEmployeeById(employee_id);
        const { resolvedItems, totalQuantity } = await getItemById(items);

        const dateOfSale = new Date(date_of_sale);

        // Prepare the HTML response
        const invoiceHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .invoice-container { max-width: 800px; margin: auto; }
                    .invoice-header, .invoice-body { margin-bottom: 20px; }
                    .invoice-header-left, .invoice-header-right { float: left; width: 45%; }
                    .invoice-header-left { margin-right: 10%; }
                    .invoice-body table { width: 100%; border-collapse: collapse; }
                    .invoice-body table, .invoice-body th, .invoice-body td { border: 1px solid #ddd; }
                    .invoice-body th, .invoice-body td { padding: 8px; text-align: left; }
                    .invoice-body th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="invoice-header">
                        <h2>BILL INVOICE</h2>
                        <div class="invoice-header-body">
                            <div class="invoice-header-left">
                                <p><strong>Customer Name:</strong> ${customer?.name}</p>
                                <p><strong>Total Amount:</strong> ${totalAmount}</p>
                                <p><strong>Total Items:</strong> ${totalQuantity}</p>
                            </div>
                            <div class="invoice-header-right">
                                <p><strong>Business Name:</strong> ${employee?.business_name}</p>
                                <p><strong>Address:</strong> ${employee?.address}</p>
                                <p><strong>Number:</strong> ${employee?.phone_number}</p>
                            </div>
                        </div>
                    </div>
                    <div class="invoice-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>SR NO.</th>
                                    <th>NAME</th>
                                    <th>RATE (Rs.)</th>
                                    <th>QTY</th>
                                    <th>VALUE (Rs.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${resolvedItems.map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item._name}</td>
                                        <td>${item._prize}</td>
                                        <td>${item._count}</td>
                                        <td>${item._prize * item._count}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <p><strong>SUB TOTAL:</strong> ${totalAmount}</p>
                        <p><strong>ORDER TIME:</strong> ${dateOfSale.toLocaleTimeString()}</p>
                        <p><strong>ORDER DATE:</strong> ${dateOfSale.toLocaleDateString()}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        res.send(invoiceHtml);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { shareInvoice };
