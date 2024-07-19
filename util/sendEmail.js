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

const sendPDFtomail = (email, otp, subject, pdf) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: ` ${otp}`,
    attachments: [
      {
        filename: 'invoice.pdf',
        content: pdf,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};





module.exports = { sendEmail, sendPDFtomail };
