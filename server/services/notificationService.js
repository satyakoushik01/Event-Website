const nodemailer = require('nodemailer');
const twilio = require('twilio');

/**
 * Initialize Nodemailer transporter based on ENV variables.
 * Falls back to a console logger if any required env var is missing.
 */
function getEmailTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return null; // will use console fallback
}

/**
 * Send an email asynchronously. Returns a promise.
 * If transporter is not configured, logs the email to console.
 */
async function sendEmail(to, subject, html, attachments = []) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log('[EMAIL FALLBACK] To:', to, 'Subject:', subject);
    console.log('HTML:', html);
    console.log('Attachments:', attachments.map(a => a.filename).join(','));
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Initialize Twilio client if credentials are present.
 */
function getTwilioClient() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return null; // fallback to console
}

/**
 * Send an SMS asynchronously. Returns a promise.
 * Falls back to console logging if Twilio not configured.
 */
async function sendSMS(to, body) {
  const client = getTwilioClient();
  if (!client) {
    console.log('[SMS FALLBACK] To:', to, 'Body:', body);
    return;
  }
  const from = process.env.TWILIO_PHONE_NUMBER;
  await client.messages.create({ body, from, to });
}

module.exports = {
  sendEmail,
  sendSMS,
};
