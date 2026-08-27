import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

export default function EnquiryModal({ isOpen, onClose, vendorName, defaultPackage = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Weddings',
    eventDate: '',
    expectedGuests: '',
    location: '',
    message: defaultPackage ? `Interested in the ${defaultPackage.name} package.` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields (Name, Phone, Email).');
      return;
    }

    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matte-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg bg-warm-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-matte-black transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-champagne-gold/20 text-champagne-gold rounded-full flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="font-display text-2xl text-matte-black">Enquiry Sent Successfully</h3>
              <p className="text-gray-600 font-light text-sm max-w-sm mx-auto">
                Thank you for contacting <span className="font-medium text-matte-black">{vendorName}</span>. The Moments Group concierge team will connect with you shortly.
              </p>
              <Button onClick={handleResetAndClose} className="mt-4">
                Close Window
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-champagne-gold font-semibold">Direct Enquiry</span>
                <h3 className="font-display text-2xl text-matte-black">Connect with {vendorName}</h3>
                <p className="text-xs text-gray-500 font-light mt-1">
                  Share your celebration details to receive pricing & availability confirmation.
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-xs">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Mobile Number *"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="ananya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">Event Type</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light"
                    >
                      <option value="Weddings">Wedding Celebration</option>
                      <option value="Engagements">Engagement Ceremony</option>
                      <option value="Sangeet / Reception">Sangeet / Reception</option>
                      <option value="Birthday Parties">Birthday Party</option>
                      <option value="Corporate Events">Corporate Event</option>
                      <option value="Anniversaries">Anniversary</option>
                      <option value="Other">Other Event</option>
                    </select>
                  </div>

                  <Input
                    label="Event Date"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Expected Guests"
                    placeholder="e.g. 300"
                    type="number"
                    value={formData.expectedGuests}
                    onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
                  />
                  <Input
                    label="Location / City"
                    placeholder="e.g. Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Message / Requirements"
                  placeholder="Tell the vendor about your theme, specific services, or budget preferences..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={handleResetAndClose}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
