const Employee = require('../dbModels/employe.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTP } = require('../util/sendEmail.js')

// Sign Up
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const emailExists = await Employee.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: { message: 'Email already exists' } });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = new Employee({ name, email, password: hashedPassword });
        await newEmployee.save();

        const employeeData = {
            _id: newEmployee._id,
            name: newEmployee.name,
            email: newEmployee.email,
        };

        const token = jwt.sign({ employee: employeeData }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '24h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ error: { message: 'Invalid email or password' } });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const employeeData = {
            _id: employee._id,
            name: employee.name,
            email: employee.email,

        };

        const token = jwt.sign({ user: employeeData }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'none' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Token Middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
        req.employee = decoded.employeeId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Generate and send OTP
const generateAndSendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const otp = generateOTP();
        employee.otp = otp;
        employee.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
        await employee.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent successfully', email: employee.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const employee = await Employee.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid OTP or email' });
        }

        const tempToken = jwt.sign({ email: employee.email }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '24h' });

        res.status(200).json({ tempToken, message: 'OTP verified', email: employee.email });
    } catch (error) {
        res.status(400).json({ message: 'Error verifying OTP. Please try again later.' });
    }
}


// Change Password
const changePassword = async (req, res) => {
    const { tempToken, newPassword } = req.body;
    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'JWT_SECRET');
        const { email } = decoded;

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(newPassword, salt);
        employee.otp = undefined;
        employee.otpExpires = undefined;
        await employee.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login,
    verifyToken,
    generateAndSendOTP,
    verifyOTP,
    changePassword
};
