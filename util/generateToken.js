const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userData, expiresIn) => {
  return jwt.sign({ user: userData }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn });
};

module.exports = generateToken;
