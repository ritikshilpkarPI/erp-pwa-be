const customerModel = require('../dbModels/customer.model');

const getCustomerById = async (id) => {
    try {
        const customer = await customerModel.findById(id);
        return customer;
    } catch (error) {
        console.log(error);

    }
};

module.exports = { getCustomerById }