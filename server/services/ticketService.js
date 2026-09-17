const crypto = require('crypto');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generate a unique ticket ID in the format MH-2026-XXXXXX
 */
function generateTicketId() {
  const prefix = process.env.TICKET_ID_PREFIX || 'MH-2026-';
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
  return `${prefix}${randomPart}`;
}

/**
 * Generate a QR code data URL for a given payload.
 * Payload is a signed token containing ticketId and a hash for verification.
 */
async function generateQRCode(ticketId) {
  // Simple sign: HMAC of ticketId with secret
  const secret = process.env.QR_CODE_SECRET || 'default_qr_secret';
  const sig = crypto.createHmac('sha256', secret).update(ticketId).digest('hex');
  const payload = `${ticketId}:${sig}`;
  // Generate high‑density QR code as Data URL (PNG)
  const qrDataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'H', type: 'image/png', width: 300 });
  return { qrDataUrl, payload };
}

/**
 * Create a PDF ticket stream containing branding, event details and QR.
 * Returns a readable stream that can be piped to response or saved.
 */
function generatePDFTicket({ booking, event, ticketId, qrDataUrl }) {
  const doc = new PDFDocument({ size: 'A5', margin: 30 });

  // Header with logo (placeholder) and title
  doc.fontSize(18).font('Helvetica-Bold').text('MomentsHub Ticket', { align: 'center' });
  doc.moveDown(0.5);

  // Event Info
  doc.fontSize(12).font('Helvetica');
  doc.text(`Event: ${event.title}`);
  doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`);
  doc.text(`Time: ${booking.showTiming}`);
  doc.text(`Category: ${booking.ticketCategory}`);
  doc.text(`Quantity: ${booking.quantity}`);
  doc.text(`Ticket ID: ${ticketId}`);
  doc.moveDown(0.5);

  // QR Code image
  const imgBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  doc.image(imgBuffer, { fit: [150, 150], align: 'center' });

  doc.end();
  return doc;
}

module.exports = {
  generateTicketId,
  generateQRCode,
  generatePDFTicket,
};
