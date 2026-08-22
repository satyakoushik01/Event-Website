import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-white">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-matte-black">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop"
          alt="Luxury Event"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <Link to="/" className="inline-block mb-12">
            <img src="/logo.png" alt="Moments Group" className="h-16 w-auto object-contain" />
          </Link>
          <h2 className="font-display text-4xl text-white mb-4 leading-tight">
            Welcome back to<br/><span className="text-champagne-gold italic">your celebrations.</span>
          </h2>
          <p className="text-white/50 font-light text-sm tracking-wide">
            Your exclusive event planning studio awaits.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <img src="/logo.png" alt="Moments Group" className="h-12 w-auto object-contain" />
            </Link>
            <h1 className="font-display text-4xl text-matte-black mt-8 mb-2">Sign In</h1>
            <p className="text-gray-400 font-light tracking-wide">Access your private account</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm font-light rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
            <div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
              />
              <div className="text-right mt-3">
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-champagne-gold transition-colors tracking-widest uppercase">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Continue
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-10 font-light">
            New to Moments?{' '}
            <Link to="/register" className="text-matte-black font-medium hover:text-champagne-gold transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
