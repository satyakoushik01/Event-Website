import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { resendVerification } from '../../api/auth';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/bookings', label: 'Bookings' },
  { to: '/dashboard/wishlist', label: 'Wishlist' },
  { to: '/dashboard/notifications', label: 'Notifications' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    setResendMsg('');
    try {
      await resendVerification(user.email);
      setResendMsg('Verification email sent! Check your inbox.');
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to send. Try again later.');
    } finally {
      setResending(false);
    }
  };

  const showBanner = user && !user.isEmailVerified && !bannerDismissed;

  return (
    <div className="bg-warm-white min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Verification Banner */}
        {showBanner && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <div>
              <p className="text-sm font-medium text-amber-800">Email verification required</p>
              {resendMsg ? (
                <p className={`text-xs mt-1 font-light ${resendMsg.includes('sent') ? 'text-green-700' : 'text-red-600'}`}>
                  {resendMsg}
                </p>
              ) : (
                <p className="text-xs text-amber-600 mt-1 font-light">Please verify your email to access all features.</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleResend}
                disabled={resending || resendMsg.includes('sent')}
                className="text-xs font-semibold px-4 py-2 rounded-full bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resending ? 'Sending…' : 'Resend Email'}
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-amber-400 hover:text-amber-600 text-xl leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 pb-10 border-b border-gray-100"
        >
          <h1 className="font-display text-4xl md:text-5xl text-matte-black mb-2">
            Welcome, {user?.name?.split(' ')[0]}.
          </h1>
          <p className="text-gray-400 font-light tracking-wide">Your private event dashboard</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex flex-row lg:flex-col flex-wrap gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm tracking-wide transition-all duration-300 ${
                      isActive
                        ? 'text-champagne-gold font-medium pl-6 border-l-2 border-champagne-gold'
                        : 'text-gray-400 hover:text-matte-black hover:pl-5 font-light'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
