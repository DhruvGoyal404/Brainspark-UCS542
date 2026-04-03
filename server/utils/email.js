/**
 * Email Utility — Uses Nodemailer with Gmail
 * Emails must be enabled on the Gmail account or app passwords used
 */
const nodemailer = require('nodemailer');

// Create transporter using Gmail (requires app password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

/**
 * Send password reset email
 * @param {string} email - recipient email
 * @param {string} resetLink - full URL with token
 */
const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BrainSpark - Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0;">🧠 BrainSpark</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy this link:</p>
                    <p style="color: #667eea; word-break: break-all; font-size: 12px;">${resetLink}</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                    <p style="color: #999; font-size: 12px;">This link expires in 15 minutes. If you didn't request this, please ignore this email.</p>
                </div>
                <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
                    <p>&copy; 2026 BrainSpark. All rights reserved.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, message: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail
};
