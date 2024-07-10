const transporter = require('../configs/nodeMailerConfig');

const sendEmail = (email, otp, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: `${message} ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
