import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-white">
      {/* Right panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 order-last relative overflow-hidden bg-matte-black">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
          alt="Luxury Wedding"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <p className="font-display text-5xl italic text-champagne-gold mb-6">"</p>
          <blockquote className="font-display text-2xl text-white leading-relaxed mb-6">
            The most beautiful events are crafted with the finest people.
          </blockquote>
          <p className="text-white/40 text-xs uppercase tracking-widest">— Moments Group</p>
        </div>
      </div>

      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <img src="/logo.png" alt="Moments Group" className="h-12 w-auto object-contain" />
            </Link>
            <h1 className="font-display text-4xl text-matte-black mt-8 mb-2">Begin Your Journey</h1>
            <p className="text-gray-400 font-light tracking-wide">Create your exclusive account</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm font-light rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <select
              value={form.role || 'client'}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold w-full"
            >
              <option value="client">Client</option>
              <option value="partner">Partner</option>
            </select>
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="Min. 6 characters"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg" variant="gold">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-10 font-light">
            Already a member?{' '}
            <Link to="/login" className="text-matte-black font-medium hover:text-champagne-gold transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
