import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBooking, cancelBooking } from '../../api/bookings';
import { createPaymentOrder, verifyPayment, loadRazorpayScript } from '../../api/payments';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const statusColor = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'purple',
  'in-progress': 'purple',
};

const paymentStatusColor = {
  unpaid: 'red',
  partial: 'yellow',
  paid: 'green',
};

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState('');

  const fetchBooking = () => {
    getBooking(id)
      .then(({ data }) => setBooking(data.booking))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const { data } = await cancelBooking(id, 'Cancelled by user');
      setBooking(data.booking);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async () => {
    setPaying(true);
    setPaymentMsg('');

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPaymentMsg('Failed to load payment gateway. Please check your internet connection.');
        setPaying(false);
        return;
      }

      // Create order
      const { data } = await createPaymentOrder(id);

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Moments Group',
        description: `Payment for ${data.booking.vendor}`,
        order_id: data.order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response) => {
          // Verify payment on backend
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaymentMsg('Payment successful! 🎉');
            fetchBooking(); // Refresh booking data
          } catch (err) {
            setPaymentMsg(err.response?.data?.message || 'Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setPaymentMsg(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      razorpay.open();
    } catch (err) {
      setPaymentMsg(err.response?.data?.message || 'Could not initiate payment. Try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader />;
  if (!booking) return <p className="text-gray-500">Booking not found</p>;

  const canCancel = !['completed', 'cancelled'].includes(booking.status);
  const canPay =
    booking.paymentStatus !== 'paid' &&
    !['cancelled', 'completed'].includes(booking.status);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="font-display font-semibold text-xl">{booking.vendor?.businessName}</h2>
            <p className="text-gray-500">{booking.eventType}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge color={statusColor[booking.status] || 'gray'}>{booking.status}</Badge>
            <Badge color={paymentStatusColor[booking.paymentStatus] || 'gray'}>
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-gray-500">Date:</span>{' '}
            <span className="font-medium">
              {new Date(booking.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>{' '}
            <span className="font-semibold text-primary-600">
              ₹{booking.totalAmount?.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Guests:</span>{' '}
            <span className="font-medium">{booking.guestCount || '—'}</span>
          </div>
          {booking.eventLocation?.city && (
            <div>
              <span className="text-gray-500">Location:</span>{' '}
              <span className="font-medium">
                {[booking.eventLocation.venue, booking.eventLocation.city].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Services breakdown */}
        {booking.services?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Services</h3>
            <div className="space-y-2">
              {booking.services.map((s, i) => (
                <div key={i} className="flex justify-between text-sm p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>}
                  </div>
                  <p className="font-medium text-primary-600 shrink-0">₹{s.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.notes && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm">
            <p className="text-gray-500 mb-1 font-medium">Notes</p>
            <p>{booking.notes}</p>
          </div>
        )}

        {booking.specialRequirements && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl text-sm border border-amber-100">
            <p className="text-amber-700 mb-1 font-medium">Special Requirements</p>
            <p className="text-amber-800">{booking.specialRequirements}</p>
          </div>
        )}

        {/* Payment message */}
        {paymentMsg && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              paymentMsg.includes('successful') || paymentMsg.includes('🎉')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {paymentMsg}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {canPay && (
            <Button onClick={handlePayNow} loading={paying}>
              💳 Pay Now — ₹{booking.totalAmount?.toLocaleString()}
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" onClick={handleCancel} loading={cancelling}>
              Cancel Booking
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
