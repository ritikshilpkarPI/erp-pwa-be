const Sale = require('../dbModels/sale.model');
const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');

const getSaleById = async (id) => {
    try {
        if (!id){
            throw new Error("Sale not found")
        }
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

const  shareInvoice = async (req, res) => {
    const { id } = req.body;

    try {
        const sale = await getSaleById(id);
        const { items, totalAmount, customer_id, employee_id, date_of_sale, TXN_id } = sale;
        const customer = await customerModel.findById(customer_id) ?? {};
        const employee = await getEmployeeById(employee_id) ?? {};
        const { resolvedItems, totalQuantity } = await getItemById(items);
        

        const dateOfSale = new Date(date_of_sale);
        const saleData = {
            customer,
            employee,
            resolvedItems,
            totalQuantity,
            totalAmount,
            date_of_sale,
            TXN_id,
        }

        
        return res.json(saleData)

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { shareInvoice };
