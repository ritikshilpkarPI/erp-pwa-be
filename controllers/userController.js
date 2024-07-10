const User = require('../dbModels/employe.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../util/sendEmail');
const getRandomNumber = require('../util/randomNumber');
const generateToken = require('../util/generateToken');

// Sign Up
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: { message: 'Email already exists' } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = generateToken(userData, '24h');

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: { message: 'Invalid email or password' } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = generateToken(userData, '24h');

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Generate and send OTP
const generateAndSendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = getRandomNumber(4); // You can adjust the length as needed
    user.otp = otp;
    user.otpExpires = Date.now() + (5 * 60 * 1000); // OTP expires in 5 minutes
    await user.save();

    await sendEmail(email, otp, 'Invoicify OTP', 'Your OTP code for email verification is');

    res.status(200).json({ message: 'OTP sent successfully', email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }

    const tempToken = generateToken({ email: user.email });

    res.status(200).json({ tempToken, message: 'OTP verified', email: user.email });
  } catch (error) {
    res.status(400).json({ message: 'Error verifying OTP. Please try again later.' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { tempToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'JWT_SECRET');
    const { email } = decoded.user;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyToken,
  generateAndSendOTP,
  verifyOTP,
  changePassword,
};