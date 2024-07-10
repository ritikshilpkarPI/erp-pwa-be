const jwt = require('jsonwebtoken');

const generateToken = (userData, expiresIn = '24h') => {
  return jwt.sign({ user: userData }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn });
};

module.exports = generateToken;
