const crypto = require('crypto');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv')
dotenv.config()
const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
      }
});

const generateOTP = () => {
      return crypto.randomInt(1000, 9999).toString();
};

const sendOTP = (email, otp) => {
      console.log(email, otp)
      const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
      };

      return transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };
