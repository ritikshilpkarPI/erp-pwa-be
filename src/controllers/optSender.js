const { sendEmail } = require("../util/sendEmail");

let otps = {};

const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Generate OTP (timestamp + 5 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000);
    otps[email] = otp;

    try {
        await sendEmail(email, otp, 'Your OTP', `Your OTP is `);
        return res.status(200).json(otp);
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
    }
};

module.exports = { sendOtp }