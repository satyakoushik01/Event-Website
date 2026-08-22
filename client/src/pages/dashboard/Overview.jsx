import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyBookings } from '../../api/bookings';
import { getWishlist } from '../../api/users';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const statusColor = { pending: 'yellow', confirmed: 'green', cancelled: 'red', completed: 'purple', 'in-progress': 'purple' };

export default function Overview() {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyBookings({ limit: 5 }), getWishlist()])
      .then(([bRes, wRes]) => {
        setBookings(bRes.data.bookings || []);
        setTotalBookings(bRes.data.total || bRes.data.bookings?.length || 0);
        setWishlistCount(wRes.data.wishlist?.length || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader className="py-20" />;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { value: totalBookings, label: 'Total Bookings', href: '/dashboard/bookings' },
          { value: wishlistCount, label: 'Saved Artisans', href: '/dashboard/wishlist' },
          { value: null, label: 'Start Planning', href: '/planner', cta: true },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass-panel rounded-2xl p-6 cinematic-shadow"
          >
            {item.cta ? (
              <Link to={item.href} className="block text-center">
                <Button className="w-full" size="md" variant="gold">Plan New Event</Button>
              </Link>
            ) : (
              <Link to={item.href}>
                <p className="font-display text-5xl text-matte-black mb-1">{item.value}</p>
                <p className="text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="glass-panel rounded-2xl cinematic-shadow overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-display text-2xl text-matte-black">Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="text-xs uppercase tracking-widest text-champagne-gold hover:text-matte-black transition-colors">
            View All →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-light mb-4">No bookings yet.</p>
            <Link to="/planner">
              <Button variant="outline">Plan Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <Link
                key={b._id}
                to={`/dashboard/bookings/${b._id}`}
                className="flex items-center justify-between p-5 hover:bg-white/50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-matte-black group-hover:text-champagne-gold transition-colors duration-300">
                    {b.vendor?.businessName}
                  </p>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    {b.eventType} · {new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <Badge color={statusColor[b.status] || 'gray'}>{b.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
