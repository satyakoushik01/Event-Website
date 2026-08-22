import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../api/contact';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

const contactDetails = [
  { label: 'Email', value: 'concierge@momentsevents.com', href: 'mailto:concierge@momentsevents.com' },
  { label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { label: 'Studio', value: 'Mumbai, Maharashtra', href: null },
  { label: 'Hours', value: 'Monday – Saturday, 9AM–7PM IST', href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Header */}
      <section className="pt-40 pb-24 px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-6 block">Private Concierge</span>
            <h1 className="font-display text-5xl md:text-7xl mb-6 text-matte-black leading-tight">
              Let's Create<br/><span className="italic font-light text-gray-400">Something Extraordinary.</span>
            </h1>
            <p className="text-gray-500 font-light text-lg leading-relaxed max-w-2xl">
              Reach out to our private concierge team and begin the conversation about your most important celebration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-12"
            >
              <div>
                <h2 className="font-display text-3xl text-matte-black mb-6">Our Details</h2>
                <div className="w-8 h-[1px] bg-champagne-gold mb-10" />
                <div className="space-y-8">
                  {contactDetails.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-matte-black font-light hover:text-champagne-gold transition-colors duration-300">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-matte-black font-light">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-8 rounded-2xl">
                <p className="font-display text-xl text-matte-black mb-3">For Urgent Inquiries</p>
                <p className="text-gray-500 font-light text-sm leading-relaxed">
                  Our concierge team is available via WhatsApp for time-sensitive requests. We respond within 2 hours during business hours.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 glass-panel rounded-3xl"
                >
                  <div className="w-16 h-16 rounded-full bg-champagne-gold/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-champagne-gold">✓</span>
                  </div>
                  <h3 className="font-display text-3xl text-matte-black mb-4">Message Received</h3>
                  <p className="text-gray-500 mb-10 font-light">Our concierge will respond within 24 hours.</p>
                  <Button onClick={() => setSuccess(false)} variant="outline">Send Another Message</Button>
                </motion.div>
              ) : (
                <div className="glass-panel rounded-3xl p-10">
                  <h2 className="font-display text-3xl text-matte-black mb-2">Send a Message</h2>
                  <div className="w-8 h-[1px] bg-champagne-gold mb-10" />
                  
                  {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-light">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <Input label="Your Name" name="name" value={form.name} onChange={handleChange} required placeholder="Ananya Kapoor" />
                      <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ananya@example.com" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                      <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} required placeholder="Destination Wedding" />
                    </div>
                    <Textarea
                      label="Your Message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your vision, date, expected guests, and budget..."
                    />
                    <Button type="submit" loading={loading} size="lg" variant="gold" className="w-full">
                      Send Enquiry
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
