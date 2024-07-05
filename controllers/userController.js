const Employee = require('../dbModels/employe.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTP } = require('../util/sendOtp.js')

// Sign Up
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ error: { message: 'Employee already exists' } });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = new Employee({ name, email, password: hashedPassword });
        await newEmployee.save();

        const token = jwt.sign({ employeeId: newEmployee._id }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '1h' });

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

        const token = jwt.sign({ name: employee.name, email: employee.email }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '1h' });

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
    const { input } = req.body;

    try {
        const employee = await Employee.findOne({ email: input });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const otp = generateOTP();
        employee.otp = otp;
        employee.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
        await employee.save();

        await sendOTP(employee.email, otp);

        res.status(200).json({ message: 'OTP sent successfully', email: employee.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        const employee = await Employee.findOne({ otp, otpExpires: { $gt: Date.now() } });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found or OTP expired' });
        }

        // Generate a temporary token for password change
        const tempToken = jwt.sign({ email: employee.email }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '5m' });

        res.status(200).json({ tempToken, message: 'OTP verified', email: employee.email });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP. Please try again later.' });
    }
};

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
