import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getBooking } from '../api/bookings';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function generateBookingId(id) {
  const shortId = String(id || '').slice(-6).toUpperCase();
  return `MG-${new Date().getFullYear()}-${shortId}`;
}

export default function CheckoutSuccess() {
  const { bookingId } = useParams();
  const location = useLocation();
  const receiptRef = useRef(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Try to get data from navigation state first (fastest), fall back to API
  const navState = location.state;

  useEffect(() => {
    if (navState?.booking) {
      // Data already available from Checkout page navigation state
      setLoading(false);
    } else {
      getBooking(bookingId)
        .then(({ data }) => setBooking(data.booking))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [bookingId, navState]);

  // Simulate Email + SMS confirmation (structured for easy Nodemailer/Twilio integration)
  useEffect(() => {
    if (!loading) {
      const bookingRef = navState?.booking || booking;
      if (bookingRef) {
        // --- EMAIL SIMULATION ---
        // To integrate: replace with: await nodemailer.transporter.sendMail({ to: user.email, subject, html })
        console.log('[EMAIL SIMULATION] Sending booking confirmation email:', {
          to: navState?.user?.email || 'user@example.com',
          subject: `✅ Booking Confirmed - ${bookingRef._id || bookingId}`,
          body: `Dear ${navState?.user?.name || 'Guest'}, your booking for ${navState?.vendor?.businessName || 'the vendor'} has been confirmed. Booking ID: ${generateBookingId(bookingRef._id || bookingId)}. Total Amount: ₹${bookingRef.totalAmount?.toLocaleString()}.`,
        });

        // --- SMS SIMULATION ---
        // To integrate: replace with: await twilio.messages.create({ to: user.phone, body })
        console.log('[SMS SIMULATION] Sending booking confirmation SMS:', {
          to: navState?.user?.phone || '+91 XXXXXXXXXX',
          body: `Moments Group: Booking confirmed! ID: ${generateBookingId(bookingRef._id || bookingId)}. Vendor: ${navState?.vendor?.businessName}. Amount: ₹${bookingRef.totalAmount?.toLocaleString()}. Date: ${bookingRef.eventDate ? new Date(bookingRef.eventDate).toLocaleDateString('en-IN') : 'N/A'}`,
        });
      }
    }
  }, [loading]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 10;

      pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
      pdf.save(`MomentsGroup_Invoice_${generateBookingId(bookingId)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader className="min-h-screen" />;

  // Resolve booking data from nav state or API
  const bookingData = navState?.booking || (booking ? {
    _id: booking._id,
    eventType: booking.eventType,
    eventDate: booking.eventDate,
    city: booking.eventLocation?.city,
    venue: booking.eventLocation?.venue,
    guestCount: booking.guestCount,
    totalAmount: booking.totalAmount,
    selectedPackage: booking.services?.[0]?.name,
    paymentId: null,
  } : null);

  const vendorData = navState?.vendor || {
    businessName: booking?.vendor?.businessName,
    category: booking?.vendor?.category,
    coverImage: booking?.vendor?.logo,
  };

  const userData = navState?.user || {
    name: booking?.user?.name || 'Guest',
    email: booking?.user?.email,
    phone: booking?.user?.phone,
  };

  const bookingRef = generateBookingId(bookingId);
  const paidDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const eventDate = bookingData?.eventDate
    ? new Date(bookingData.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-warm-white min-h-screen py-32 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Animated Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-4 block">Reservation Confirmed</span>
          <h1 className="font-display text-4xl md:text-5xl text-matte-black mb-4">Payment Successful</h1>
          <p className="text-gray-500 font-light text-lg leading-relaxed max-w-xl mx-auto">
            Thank you for choosing <span className="font-medium text-matte-black">{vendorData?.businessName || 'Moments Group'}</span>. Your extraordinary experience has been reserved.
          </p>
        </motion.div>

        {/* Printable Receipt / Invoice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* IMPORTANT: This div is what gets captured into the PDF */}
          <div ref={receiptRef} className="bg-white rounded-3xl overflow-hidden border border-gray-100" style={{ fontFamily: 'Georgia, serif' }}>

            {/* Invoice Header */}
            <div className="bg-[#1c1c1c] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-sans font-semibold mb-2">Tax Invoice</p>
                <h2 className="text-white text-3xl font-serif">Moments Group</h2>
                <p className="text-white/50 text-sm font-sans font-light mt-1">India's Most Exclusive Event Platform</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase tracking-widest font-sans mb-1">Booking ID</p>
                <p className="text-champagne-gold font-sans font-bold text-xl tracking-wider">{bookingRef}</p>
                <p className="text-white/40 text-xs font-sans mt-1">{paidDate}</p>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-8 md:p-10">

              {/* Billed To + Vendor */}
              <div className="grid md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-sans font-medium mb-3">Billed To</p>
                  <p className="font-semibold text-gray-800">{userData.name}</p>
                  {userData.email && <p className="text-gray-500 text-sm font-sans font-light mt-1">{userData.email}</p>}
                  {userData.phone && <p className="text-gray-500 text-sm font-sans font-light">{userData.phone}</p>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-sans font-medium mb-3">Service Provider</p>
                  <p className="font-semibold text-gray-800">{vendorData.businessName}</p>
                  <p className="text-[#b8962e] text-sm font-sans font-medium mt-1">{vendorData.category}</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-10 pb-10 border-b border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-sans font-medium mb-4">Event Details</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Event Type', value: bookingData?.eventType },
                    { label: 'Event Date', value: eventDate },
                    { label: 'Location', value: bookingData?.city },
                    { label: 'Venue', value: bookingData?.venue || '—' },
                    { label: 'Guests', value: bookingData?.guestCount || '—' },
                    { label: 'Package', value: bookingData?.selectedPackage || 'Base Package' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans mb-1">{label}</p>
                      <p className="text-gray-800 font-sans font-medium text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8 font-sans" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-[10px] uppercase tracking-widest text-gray-400 font-medium pb-3">Description</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-gray-400 font-medium pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{bookingData?.selectedPackage || 'Booking Package'}</p>
                      <p className="text-xs text-gray-400 font-light mt-0.5">{vendorData.category} · {vendorData.businessName}</p>
                    </td>
                    <td className="text-right py-4 font-medium text-gray-800">₹{(bookingData?.totalAmount || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-sm text-gray-500 font-light">Platform Fee</td>
                    <td className="text-right py-3 text-sm text-gray-400">Included</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-sm text-gray-500 font-light">Taxes & GST</td>
                    <td className="text-right py-3 text-sm text-gray-400">Included</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="pt-6 font-semibold text-gray-800 text-lg">Total Paid</td>
                    <td className="text-right pt-6 font-bold text-2xl text-[#1c1c1c]" style={{ fontFamily: 'Georgia, serif' }}>
                      ₹{(bookingData?.totalAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment Status */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans mb-1">Payment Status</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-sans font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Paid
                  </span>
                </div>
                {bookingData?.paymentId && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans mb-1">Payment ID</p>
                    <p className="text-gray-700 text-sm font-sans font-mono">{bookingData.paymentId}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans mb-1">Payment Date</p>
                  <p className="text-gray-700 text-sm font-sans">{paidDate}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-gray-400 font-sans text-xs font-light">
                  This is a computer-generated invoice and does not require a physical signature. <br />
                  For queries, contact <span className="text-[#b8962e]">support@momentsgroup.com</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" onClick={handleDownloadPDF} loading={downloading} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Invoice
          </Button>
          <Link to={`/dashboard/bookings/${bookingId}`}>
            <Button variant="outline" size="lg" className="w-full">View Booking</Button>
          </Link>
          <Link to="/vendors">
            <Button variant="outline" size="lg" className="w-full">Explore More Vendors</Button>
          </Link>
        </motion.div>

        <p className="text-center text-gray-400 font-light text-sm mt-6">
          A confirmation has been sent to <span className="font-medium">{userData.email || 'your registered email'}</span>
        </p>
      </div>
    </div>
  );
}
