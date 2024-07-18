const Sale = require('../dbModels/sale.model');
const { getItemById } = require('./downloadInvoice');

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

exports.transationHistory = async (req, res, next) => {
    const { id } = req.body;
    const transaction = await getSaleById(id);
    const itemss = transaction['items'];
    const formatedItem = await getItemById(itemss);
    res.json({
        transaction: transaction,
        items: formatedItem
    })
}