const createTransporter = require('../config/email');

const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

// Email templates
const emailTemplates = {
  verifyEmail: (name, url) => `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B5CF6; margin: 0;">Moments Events</h1>
      </div>
      <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1F2937; margin-top: 0;">Welcome, ${name}! 🎉</h2>
        <p style="color: #6B7280; line-height: 1.6;">Thank you for joining Moments Events. Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 14px 40px; border-radius: 999px; font-weight: 600; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px;">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    </div>
  `,

  resetPassword: (name, url) => `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B5CF6; margin: 0;">Moments Events</h1>
      </div>
      <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1F2937; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #6B7280; line-height: 1.6;">Hi ${name}, we received a request to reset your password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 14px 40px; border-radius: 999px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px;">This link will expire in 30 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `,

  bookingConfirmation: (name, booking) => `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B5CF6; margin: 0;">Moments Events</h1>
      </div>
      <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1F2937; margin-top: 0;">Booking Confirmed! 🎊</h2>
        <p style="color: #6B7280; line-height: 1.6;">Hi ${name}, your booking has been confirmed.</p>
        <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #374151;"><strong>Event:</strong> ${booking.eventType}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Date:</strong> ${booking.eventDate}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Amount:</strong> ₹${booking.totalAmount}</p>
        </div>
        <p style="color: #9CA3AF; font-size: 13px;">You can view your booking details in your dashboard.</p>
      </div>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates };
