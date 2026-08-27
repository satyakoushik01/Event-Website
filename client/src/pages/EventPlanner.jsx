import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getVendors } from '../api/vendors';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { EVENT_CATEGORIES, VENDOR_CATEGORIES } from '../constants/categories';
import { PLACEHOLDER_IMAGE } from '../constants/images';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Loader from '../components/ui/Loader';

const STEPS = ['Event Type', 'Services', 'Details', 'Vendors', 'Confirm'];

export default function EventPlanner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    eventType: '',
    services: [],
    eventDate: '',
    city: '',
    venue: '',
    guestCount: '',
    budget: '',
    notes: '',
    selectedVendors: [],
  });

  const preselectedVendor = searchParams.get('vendor');

  useEffect(() => {
    if (preselectedVendor) {
      setForm((f) => ({ ...f, selectedVendors: [preselectedVendor] }));
    }
  }, [preselectedVendor]);

  useEffect(() => {
    if (step === 3) {
      setLoadingVendors(true);
      const params = { limit: 20 };
      if (form.services.length > 0) params.category = form.services[0];
      getVendors(params)
        .then(({ data }) => setVendors(data.vendors || []))
        .catch(() => {})
        .finally(() => setLoadingVendors(false));
    }
  }, [step, form.services]);

  const toggleService = (service) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }));
  };

  const toggleVendor = (id) => {
    setForm((f) => ({
      ...f,
      selectedVendors: f.selectedVendors.includes(id)
        ? f.selectedVendors.filter((v) => v !== id)
        : [...f.selectedVendors, id],
    }));
  };

  const handleSubmit = async () => {
    if (!user) return navigate('/login', { state: { from: { pathname: '/planner' } } });
    if (form.selectedVendors.length === 0) return alert('Please select at least one vendor');

    setSubmitting(true);
    try {
      for (const vendorId of form.selectedVendors) {
        const vendor = vendors.find((v) => v._id === vendorId);
        const totalAmount = vendor?.services?.[0]?.price || parseInt(form.budget) || 0;
        await createBooking({
          vendor: vendorId,
          eventType: form.eventType,
          eventDate: form.eventDate,
          eventLocation: { venue: form.venue, city: form.city },
          guestCount: parseInt(form.guestCount) || 0,
          totalAmount,
          notes: form.notes,
          services: vendor?.services?.slice(0, 1).map((s) => ({
            name: s.name,
            price: s.price,
            description: s.description,
          })) || [],
        });
      }
      navigate('/dashboard/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = () => {
    if (step === 0) return !!form.eventType;
    if (step === 1) return form.services.length > 0;
    if (step === 2) return form.eventDate && form.city;
    if (step === 3) return form.selectedVendors.length > 0;
    return true;
  };

  return (
    <div className="bg-warm-white min-h-screen pb-8">
      {/* Header */}
      <section className="pt-40 pb-20 px-6 lg:px-8 border-b border-gray-100 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-4 block">Private Concierge</span>
          <h1 className="font-display text-5xl md:text-7xl text-matte-black mb-4">The Planner</h1>
          <p className="text-gray-400 font-light tracking-wide">Craft your extraordinary event in five elegant steps.</p>
        </motion.div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          {/* Progress stepper */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-500 ${
                    i < step ? 'bg-champagne-gold border-champagne-gold text-matte-black' :
                    i === step ? 'bg-matte-black border-matte-black text-white' :
                    'bg-transparent border-gray-200 text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`mt-2 text-[10px] uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                    i <= step ? 'text-matte-black font-medium' : 'text-gray-300'
                  }`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-[1px] mx-2 transition-colors duration-500 ${i < step ? 'bg-champagne-gold' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="glass-panel rounded-3xl p-10 cinematic-shadow overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Step 0: Event Type */}
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-3xl text-matte-black mb-2">What occasion are you crafting?</h2>
                    <div className="w-8 h-[1px] bg-champagne-gold mb-8" />
                    <div className="grid grid-cols-2 gap-3">
                      {EVENT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setForm({ ...form, eventType: cat })}
                          className={`p-4 rounded-2xl border text-sm tracking-wide font-medium transition-all duration-300 text-left ${
                            form.eventType === cat
                              ? 'border-matte-black bg-matte-black text-white'
                              : 'border-gray-200 text-gray-600 hover:border-matte-black hover:text-matte-black'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Services */}
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-3xl text-matte-black mb-2">Which services do you need?</h2>
                    <div className="w-8 h-[1px] bg-champagne-gold mb-8" />
                    <div className="grid grid-cols-2 gap-3">
                      {VENDOR_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleService(cat)}
                          className={`p-4 rounded-2xl border text-sm tracking-wide font-medium transition-all duration-300 text-left ${
                            form.services.includes(cat)
                              ? 'border-champagne-gold bg-champagne-gold/10 text-matte-black'
                              : 'border-gray-200 text-gray-600 hover:border-matte-black'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <div>
                    <h2 className="font-display text-3xl text-matte-black mb-2">Tell us the details.</h2>
                    <div className="w-8 h-[1px] bg-champagne-gold mb-8" />
                    <div className="space-y-8">
                      <Input label="Event Date" type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
                      <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required placeholder="e.g. Mumbai" />
                      <Input label="Venue (optional)" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Taj Palace Hotel" />
                      <div className="grid grid-cols-2 gap-6">
                        <Input label="Number of Guests" type="number" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} placeholder="e.g. 200" />
                        <Input label="Budget (₹)" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 500000" />
                      </div>
                      <Textarea label="Special Requests" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any specific requirements or vision..." />
                    </div>
                  </div>
                )}

                {/* Step 3: Vendor Selection */}
                {step === 3 && (
                  <div>
                    <h2 className="font-display text-3xl text-matte-black mb-2">Choose your artisans.</h2>
                    <div className="w-8 h-[1px] bg-champagne-gold mb-8" />
                    {loadingVendors ? (
                      <Loader className="py-12" />
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {vendors.map((v) => {
                          const selected = form.selectedVendors.includes(v._id);
                          return (
                            <button
                              key={v._id}
                              onClick={() => toggleVendor(v._id)}
                              className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 ${
                                selected ? 'border-matte-black bg-matte-black/5' : 'border-gray-100 hover:border-gray-300'
                              }`}
                            >
                              <img src={v.coverImage?.url || v.logo?.url || PLACEHOLDER_IMAGE} alt={v.businessName} className="w-14 h-14 rounded-xl object-cover cinematic-shadow" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-matte-black text-sm">{v.businessName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge color="gray">{v.category}</Badge>
                                  <StarRating rating={v.rating} />
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                selected ? 'border-champagne-gold bg-champagne-gold text-matte-black text-xs' : 'border-gray-300'
                              }`}>
                                {selected && '✓'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && (
                  <div>
                    <h2 className="font-display text-3xl text-matte-black mb-2">Review your plan.</h2>
                    <div className="w-8 h-[1px] bg-champagne-gold mb-8" />
                    <div className="divide-y divide-gray-100">
                      {[
                        { label: 'Event Type', value: form.eventType },
                        { label: 'Services', value: form.services.join(', ') },
                        { label: 'Date', value: form.eventDate },
                        { label: 'Location', value: form.city + (form.venue ? `, ${form.venue}` : '') },
                        { label: 'Guests', value: form.guestCount || '—' },
                        { label: 'Budget', value: form.budget ? `₹${parseInt(form.budget).toLocaleString()}` : '—' },
                        { label: 'Artisans Selected', value: `${form.selectedVendors.length} artisan${form.selectedVendors.length !== 1 ? 's' : ''}` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between py-4 text-sm">
                          <span className="text-gray-400 font-light uppercase tracking-widest text-xs">{item.label}</span>
                          <span className="font-medium text-matte-black text-right max-w-[60%]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-8 border-t border-gray-100">
              <Button variant="ghost" onClick={back} disabled={step === 0}>← Back</Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next} disabled={!canNext()}>Continue →</Button>
              ) : (
                <Button variant="gold" onClick={handleSubmit} loading={submitting} size="lg">
                  Confirm & Reserve
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
