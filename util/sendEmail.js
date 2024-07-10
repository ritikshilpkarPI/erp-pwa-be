const nodeMailerConfig = require('../configs/nodeMailerConfig');

const sendEmail = (email, otp, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: `${text} ${otp}`,
  };

  return nodeMailerConfig.sendMail(mailOptions);
};

module.exports = sendEmail;
