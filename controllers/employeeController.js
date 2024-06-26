const Employee = require('../dbModels/employe.model');

// Create a new employee
const createEmployee = async (req, res) => {
    const { name, username, business_name } = req.body;
    try {
        const newEmployee = new Employee({ name, username, business_name });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findById(id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee by ID
const updateEmployeeById = async (req, res) => {
    const { id } = req.params;
    const { name, username, business_name } = req.body;
    try {
        const employee = await Employee.findByIdAndUpdate(
            id,
            { name, username, business_name },
            { new: true }
        );
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete employee by ID
const deleteEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findByIdAndDelete(id);
        if (employee) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEmployee,
getEmployeeById,
getAllEmployees,
updateEmployeeById,
deleteEmployeeById,
}