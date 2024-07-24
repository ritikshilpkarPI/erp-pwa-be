const customerModel = require('../dbModels/customer.model');
const employeModel = require('../dbModels/employe.model');
const itemModel = require('../dbModels/item.model');
const Sale = require('../dbModels/sale.model');


const getSaleById = async (id) => {
    try {
        const sale = await Sale.findById(id);
        if (sale) {
            return sale;
        } else {
            console.log("something went wrong");
        }
    } catch (error) {
        console.log(error);
    }
};

let totalQuantity;
const getItemById = async (items) => {
    totalQuantity = 0;
    try {
        const itemPromises = items.map(async (item) => {
            const foundItem = await itemModel.findById(item._id);
            if (!foundItem) {
                return { error: 'Item not found' };
            }
            totalQuantity += item._count;
            return {
                _name: foundItem.name,
                _prize: foundItem.prize,
                _count: item._count,
            };
        });

        const resolvedItems = await Promise.all(itemPromises);


        resolvedItems.forEach(item => {
            item._totalQuantity = totalQuantity;
        });

        return resolvedItems;
    } catch (error) {
        console.log(error);
        return "something went wrong"
    }
};

const getEmployeeById = async (id) => {
    try {
        const employee = await employeModel.findById(id);
        return employee;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching employee');
    }
};

const getCustomerById = async (id) => {
    try {
        const customer = await customerModel.findById(id);
        return customer;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching customer');
    }
};


exports.transationHistory = async (req, res, next) => {
    const { id } = req.body;
    const transaction = await getSaleById(id);
    const itemss = transaction['items'];
    const employeData = await getEmployeeById(transaction['employee_id']);
    const customer = await getCustomerById(transaction['customer_id']);
    const formatedItem = await getItemById(itemss);
    res.json({
        transaction: transaction,
        customer: customer,
        items: formatedItem,
        employeData: employeData
    })
}