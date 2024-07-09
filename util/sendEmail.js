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
      return Math.floor(1000 + Math.random() * 9000).toString();
    };
    

const sendOTP = (email, otp) => {
      const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invoicify OTP',
            text: `Your OTP code for email verification is ${otp}`,
      };

      return transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };
