const nodeMailerConfig = require('../configs/nodeMailerConfig');

const sendEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invoicify OTP',
    text: `Your OTP code for email verification is ${otp}`,
  };

  return nodeMailerConfig.sendMail(mailOptions);
};

module.exports = sendEmail;
