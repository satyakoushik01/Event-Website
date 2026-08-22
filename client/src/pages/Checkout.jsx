import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getVendor } from '../api/vendors';
import { createBooking } from '../api/bookings';
import { createPaymentOrder, verifyPayment, loadRazorpayScript } from '../api/payments';
import { useAuth } from '../context/AuthContext';
import { EVENT_CATEGORIES } from '../constants/categories';
import { PLACEHOLDER_IMAGE } from '../constants/images';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';

const COUPONS = {
  'MOMENTS10': 0.10,
  'LUXURY20': 0.20,
  'FIRST15': 0.15,
};

export default function Checkout() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get pre-selected package and date from VendorDetails navigation state
  const preSelectedPackage = location.state?.package || null;
  const preSelectedDate = location.state?.date ? new Date(location.state.date) : null;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [selectedService, setSelectedService] = useState(preSelectedPackage);

  const [form, setForm] = useState({
    eventType: '',
    eventDate: preSelectedDate ? preSelectedDate.toISOString().split('T')[0] : '',
    city: '',
    venue: '',
    guestCount: '',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/checkout/${vendorId}` } } });
      return;
    }
    getVendor(vendorId)
      .then(({ data }) => {
        const v = data.vendor;
        setVendor(v);
        // If no package pre-selected, default to first
        if (!preSelectedPackage && v.services?.length > 0) {
          setSelectedService(v.services[0]);
        }
      })
      .catch(() => setError('Unable to load vendor details for checkout.'))
      .finally(() => setLoading(false));
  }, [vendorId, user, navigate]);

  const basePrice = selectedService?.price || vendor?.priceRange?.min || vendor?.services?.[0]?.price || 50000;
  const discount = appliedCoupon ? Math.round(basePrice * appliedCoupon.rate) : 0;
  const totalAmount = basePrice - discount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setAppliedCoupon({ code, rate: COUPONS[code] });
    } else {
      setCouponError('Invalid coupon code. Try MOMENTS10, LUXURY20, or FIRST15.');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.eventType || !form.eventDate || !form.city) {
      setError('Please fill in Event Type, Event Date, and City before proceeding.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment gateway. Please check your internet connection.');

      // Create booking
      const bookingRes = await createBooking({
        vendor: vendorId,
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventLocation: { venue: form.venue, city: form.city },
        guestCount: parseInt(form.guestCount) || 0,
        totalAmount,
        notes: form.notes,
        services: selectedService
          ? [{ name: selectedService.name, price: selectedService.price, description: selectedService.description }]
          : vendor.services?.slice(0, 1).map((s) => ({ name: s.name, price: s.price, description: s.description })) || [],
      });

      const booking = bookingRes.data.booking;

      // Create Razorpay order
      const orderRes = await createPaymentOrder(booking._id);
      const { key, order } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Moments Group',
        description: `Booking for ${vendor.businessName}`,
        order_id: order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
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
                vendor: { businessName: vendor.businessName, category: vendor.category, coverImage: vendor.coverImage },
                booking: {
                  _id: booking._id,
                  eventType: form.eventType,
                  eventDate: form.eventDate,
                  city: form.city,
                  venue: form.venue,
                  guestCount: form.guestCount,
                  totalAmount,
                  selectedPackage: selectedService?.name,
                  paymentId: response.razorpay_payment_id,
                },
                user: { name: user.name, email: user.email, phone: user.phone },
              }
            });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            navigate('/dashboard/bookings');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setSubmitting(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred during checkout.');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader className="min-h-screen" />;
  if (error && !vendor) return <div className="text-center py-40 text-red-500">{error}</div>;

  return (
    <div className="bg-warm-white min-h-screen pb-32 pt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-4xl text-matte-black mb-2">Complete Your Booking</h1>
          <p className="text-gray-500 font-light">Provide your event details to secure your reservation with Moments Group.</p>
        </motion.div>

        {error && (
          <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">

          {/* Form */}
          <div className="lg:col-span-2 space-y-8">

            {/* Package Selection */}
            {vendor?.services?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel p-8 rounded-3xl cinematic-shadow">
                <h3 className="font-display text-2xl text-matte-black mb-6">Selected Package</h3>
                <div className="grid gap-4">
                  {vendor.services.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedService(s)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex justify-between items-center gap-4 ${
                        selectedService?.name === s.name
                          ? 'border-champagne-gold bg-champagne-gold/5'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-matte-black">{s.name}</span>
                          {selectedService?.name === s.name && (
                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest text-matte-black bg-champagne-gold rounded-full font-semibold">Selected</span>
                          )}
                        </div>
                        {s.description && <p className="text-sm text-gray-500 font-light">{s.description}</p>}
                      </div>
                      <span className="font-display text-xl text-matte-black whitespace-nowrap">₹{s.price?.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Event Details Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-panel p-8 md:p-10 rounded-3xl cinematic-shadow">
              <h3 className="font-display text-2xl text-matte-black mb-6">Event Details</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-gray-500 mb-2">Event Type *</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-gray-200 pb-2 pt-2 px-0 text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light"
                  >
                    <option value="">Select Event Type</option>
                    {EVENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <Input
                  label="Event Date *"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <Input label="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required placeholder="e.g. Mumbai" />
                <Input label="Venue (Optional)" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Taj Palace Hotel" />
              </div>
              <div className="mb-6">
                <Input label="Number of Guests" type="number" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} placeholder="e.g. 200" />
              </div>
              <Textarea label="Special Requests or Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Share any specific requirements, themes, or vision..." />
            </motion.div>

            {/* Coupon Code */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-panel p-8 rounded-3xl cinematic-shadow">
              <h3 className="font-display text-xl text-matte-black mb-4">Coupon Code</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <div>
                    <p className="font-medium text-green-700">{appliedCoupon.code} applied!</p>
                    <p className="text-sm text-green-600 font-light">{(appliedCoupon.rate * 100).toFixed(0)}% discount — saving ₹{discount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-sm text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    placeholder="Enter coupon code (e.g. MOMENTS10)"
                    className="flex-1 bg-white border border-gray-200 px-4 py-3 rounded-xl text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    type="button"
                    className="px-5 py-3 bg-matte-black text-champagne-gold rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >Apply</button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-sm mt-2 font-light">{couponError}</p>}
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="glass-panel p-8 rounded-3xl sticky top-32 cinematic-shadow">
              <h3 className="font-display text-2xl text-matte-black mb-6">Booking Summary</h3>

              <div className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-100">
                <img
                  src={vendor.coverImage?.url || vendor.logo?.url || PLACEHOLDER_IMAGE}
                  alt={vendor.businessName}
                  className="w-16 h-16 rounded-xl object-cover cinematic-shadow"
                />
                <div>
                  <h4 className="font-medium text-matte-black">{vendor.businessName}</h4>
                  <p className="text-xs uppercase tracking-widest text-champagne-gold mt-1">{vendor.category}</p>
                  {selectedService && <p className="text-xs text-gray-400 mt-1 font-light">{selectedService.name}</p>}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {form.eventDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-light">Event Date</span>
                    <span className="font-medium text-matte-black">{new Date(form.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
                {form.city && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-light">Location</span>
                    <span className="font-medium text-matte-black">{form.city}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Package</span>
                  <span className="font-medium text-matte-black">{selectedService?.name || 'Base'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Investment</span>
                  <span className="font-medium text-matte-black">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Platform Fee</span>
                  <span className="text-gray-400">Included</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-light">Coupon Discount</span>
                    <span className="font-medium">−₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-matte-black">Total</span>
                  <span className="font-display text-3xl text-matte-black">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={handleSubmit} loading={submitting} className="w-full" size="lg">
                Pay & Confirm Booking
              </Button>
              <p className="text-xs text-center text-gray-400 font-light mt-4">
                Secured by Razorpay · UPI, Cards, Net Banking & Wallets supported
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-3">Payment Methods Accepted</p>
                <div className="flex flex-wrap gap-2">
                  {['UPI', 'Cards', 'Net Banking', 'Wallets'].map(m => (
                    <span key={m} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 font-light">{m}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
