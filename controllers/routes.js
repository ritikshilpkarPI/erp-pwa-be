const router = require("express").Router();
const unAuthorizedRouter = require("express").Router();
const customerController = require('./customerController');
const categoryController = require('./categoryController');
const itemController = require('./itemController');
const employeeController = require('./employeeController');
const receivableController = require('./receivableController');
const saleController = require('./saleController');
const paymentController = require('./paymentController');
const userController = require('./userController');
const { downloadInvoice } = require("./downloadInvoice");
const { transationHistory } = require("./transHistory");
const { emailInvoice } = require("./emailInvoice");
const { sendOtp } = require("./optSender");
const { shareInvoice } = require("./shareInvoice");
const { whatsAppInvoice } = require("./whatsAppInvoice");



router.get("/get", (req, res) => {
    console.log("called");
    return res.end()
})
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers', customerController.getAllCustomers);
router.put('/customers/:id', customerController.updateCustomerById);
router.delete('/customers/:id', customerController.softDeleteCustomerById);
router.patch('/customers/:id/credit-limit', customerController.changeCreditLimitByCustomerId);
router.post('/customers', customerController.createCustomer);


// // Category routes
router.post('/categories', categoryController.createCategory);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategoryById);
router.delete('/categories/:id', categoryController.deleteCategoryById);


// // Item routes
router.post('/item/additem', itemController.createItem);
router.get('/items/:id', itemController.getItemById);
router.post('/items', itemController.getAllItems);
router.put('/items/:id', itemController.updateItemById);
router.delete('/items/:id', itemController.deleteItemById);
router.get('/items', itemController.getAllItems);

// // Employee routes
router.post('/employees', employeeController.createEmployee);
router.get('/employees/:id', employeeController.getEmployeeById);
router.get('/employees', employeeController.getAllEmployees);
router.put('/employees/:id', employeeController.updateEmployeeById);
router.delete('/employees/:id', employeeController.deleteEmployeeById);

// // Receivable routes
router.post('/receivables', receivableController.createReceivable);
router.get('/receivables/:id', receivableController.getReceivableById);
router.get('/receivables', receivableController.getAllReceivables);
router.put('/receivables/:id', receivableController.updateReceivableById);
router.delete('/receivables/:id', receivableController.deleteReceivableById);

// // Sale routes
router.get('/sales/:id', saleController.getSaleById);
router.get('/sales', saleController.getAllSales);
router.post('/sales', saleController.createSale);
router.put('/sales/:id', saleController.updateSaleById);
router.delete('/sales/:id', saleController.deleteSaleById);

// // Payment routes
router.get('/payments/:id', paymentController.getPaymentById);
router.get('/payments', paymentController.getAllPayments);
router.post('/payments', paymentController.createPayment);
router.put('/payments/:id', paymentController.updatePaymentById);
router.delete('/payments/:id', paymentController.deletePaymentById);

unAuthorizedRouter.post('/signup', userController.signup);
unAuthorizedRouter.post('/signin', userController.login);
unAuthorizedRouter.post('/generate-otp', userController.generateAndSendOTP);
unAuthorizedRouter.post('/verify-otp', userController.verifyOTP);
unAuthorizedRouter.post('/change-password', userController.changePassword);
unAuthorizedRouter.post('/resend-otp', userController.generateAndSendOTP);
unAuthorizedRouter.post('/signin-number',userController.getUserByPhoneNumber)


router.post('/download-invoice', downloadInvoice);

router.post('/email-invoice', emailInvoice);


router.post('/whatsApp-invoice', whatsAppInvoice);

router.post('/transaction-history', transationHistory);

unAuthorizedRouter.post('/share-invoice',shareInvoice)

router.post('/send-otp', sendOtp)


module.exports = {
    router,
    unAuthorizedRouter
}