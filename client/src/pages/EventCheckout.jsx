// EventCheckout.jsx - Handles checkout for event tickets
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEvent } from '../api/events';
import { createBooking } from '../api/bookings';
import { createPaymentOrder, verifyPayment, loadRazorpayScript } from '../api/payments';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';

export default function EventCheckout() {
  const { id } = useParams(); // event id
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const query = new URLSearchParams(location.search);
  const selectedDate = query.get('date') || '';
  const selectedTiming = query.get('timing') || '';
  const selectedCategory = query.get('category') || '';
  const ticketQty = parseInt(query.get('qty')) || 1;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}/checkout` } } });
      return;
    }
    getEvent(id)
      .then(({ data }) => setEvent(data.event))
      .catch(() => setError('Unable to load event details.'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (loading) return <Loader className="min-h-screen" />;
  if (error) return <div className="text-center py-40 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-40 text-gray-400">Event not found</div>;

  // Find price for selected category
  const ticketType = event.ticketTypes?.find(t => t.category === selectedCategory);
  const unitPrice = ticketType?.price || 0;
  const baseAmount = unitPrice * ticketQty;
  // Apply GST 18% and convenience fee 2%
  const gst = Math.round(baseAmount * 0.18);
  const fee = Math.round(baseAmount * 0.02);
  const totalAmount = baseAmount + gst + fee;

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay script');

      // Create booking on backend
      const bookingRes = await createBooking({
        event: id,
        eventType: event.eventType,
        ticketCategory: selectedCategory,
        ticketQuantity: ticketQty,
        date: selectedDate,
        showTiming: selectedTiming,
        totalAmount,
      });
      const booking = bookingRes.data.booking;

      // Create Razorpay order
      const orderRes = await createPaymentOrder(booking._id);
      const { key, order } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'MomentsHub Events',
        description: `Ticket for ${event.title}`,
        order_id: order.id,
        prefill: { name: user?.name || '', email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#b8962e' },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/checkout/success/${booking._id}`, {
              state: {
                event: { title: event.title, coverImage: event.coverImage },
                booking: {
                  _id: booking._id,
                  ticketCategory: selectedCategory,
                  ticketQuantity: ticketQty,
                  date: selectedDate,
                  timing: selectedTiming,
                  totalAmount,
                  paymentId: response.razorpay_payment_id,
                },
                user: { name: user.name, email: user.email, phone: user.phone },
              },
            });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => { setSubmitting(false); navigate('/events'); } },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (resp) => {
        setError(`Payment failed: ${resp.error.description}`);
        setSubmitting(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout error');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto p-6 glass-panel rounded-2xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl text-matte-black mb-4"
        >
          Confirm Your Ticket
        </motion.h2>
        <p className="text-gray-600 mb-6">{event.title}</p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between"><span>Category</span><span>{selectedCategory}</span></div>
          <div className="flex justify-between"><span>Quantity</span><span>{ticketQty}</span></div>
          <div className="flex justify-between"><span>Date</span><span>{new Date(selectedDate).toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span>Timing</span><span>{selectedTiming}</span></div>
          <div className="flex justify-between"><span>Base</span><span>₹{baseAmount.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Convenience Fee (2%)</span><span>₹{fee.toLocaleString()}</span></div>
          <div className="flex justify-between font-medium text-matte-black"><span>Total</span><span>₹{totalAmount.toLocaleString()}</span></div>
        </div>
        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded">{error}</div>}
        <Button onClick={handleSubmit} loading={submitting} className="w-full" size="lg" variant="gold">
          Pay &amp; Confirm
        </Button>
      </div>
    </div>
  );
}
