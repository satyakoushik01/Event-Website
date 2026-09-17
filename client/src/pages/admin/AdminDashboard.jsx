import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/admin';
import Loader from '../../components/ui/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data.stats))
      .catch((err) => console.error('Dashboard stats fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-gray-400 font-light">Unable to load dashboard metrics. Please check server connection.</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      subtitle: 'From confirmed bookings',
      badge: '+18.4%',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Events & Shows',
      value: stats.totalEvents || 0,
      subtitle: 'Active live listings',
      badge: 'Live',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      subtitle: `${stats.pendingBookings || 0} pending review`,
      badge: 'Active',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers || 0,
      subtitle: 'Client accounts',
      badge: 'Growing',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Approved Vendors',
      value: stats.totalVendors || 0,
      subtitle: `${stats.pendingVendors || 0} pending approval`,
      badge: stats.pendingVendors > 0 ? `${stats.pendingVendors} Pending` : 'Verified',
      badgeColor: stats.pendingVendors > 0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
        </svg>
      ),
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages || 0,
      subtitle: 'Client inquiries',
      badge: stats.unreadMessages > 0 ? 'Action Needed' : 'Clean',
      badgeColor: stats.unreadMessages > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      icon: (
        <svg className="w-6 h-6 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-matte-black via-zinc-900 to-black p-8 border border-white/10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne-gold font-medium">
              System Overview & Operations
            </span>
            <h2 className="font-display text-3xl font-light text-white mt-1">
              Welcome back to <span className="text-champagne-gold italic font-normal">Moments Command Console</span>
            </h2>
            <p className="text-white/50 text-sm mt-2 max-w-xl font-light">
              Monitor event bookings, manage platform vendors, process user requests, and oversee site activities in real-time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/admin/events"
              className="px-5 py-3 rounded-xl bg-champagne-gold text-matte-black font-medium text-sm hover:bg-gold-400 transition-all duration-300 shadow-lg hover:shadow-champagne-gold/20"
            >
              + Manage Events
            </Link>
            <Link
              to="/admin/vendors"
              className="px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 text-sm transition-all duration-300"
            >
              Review Vendors ({stats.pendingVendors || 0})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="glass-panel rounded-2xl p-6 cinematic-shadow hover:border-champagne-gold/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-matte-black/5 group-hover:bg-matte-black/10 transition-colors">
                {kpi.icon}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{kpi.title}</p>
              <h3 className="text-3xl font-display text-matte-black font-semibold mt-1 tracking-tight">
                {kpi.value}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-light">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Bookings & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings (2 columns) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 cinematic-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-display text-xl text-matte-black">Recent Event & Service Bookings</h3>
              <p className="text-xs text-gray-400 font-light">Latest reservations submitted across the platform</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs uppercase tracking-widest text-champagne-gold hover:underline font-medium"
            >
              View All →
            </Link>
          </div>

          {stats.recentBookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Event / Vendor</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/50 transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-matte-black">{b.user?.name || 'Guest User'}</p>
                        <p className="text-xs text-gray-400">{b.user?.email || 'N/A'}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-medium text-matte-black">{b.vendor?.businessName || b.eventType || 'Event Booking'}</p>
                        <p className="text-xs text-gray-400">{new Date(b.eventDate || b.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : b.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium text-matte-black">
                        ₹{(b.totalAmount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm font-light">
              No recent bookings found.
            </div>
          )}
        </div>

        {/* Right Column: Category Distribution & Quick Links */}
        <div className="space-y-6">
          {/* Top Event Categories */}
          <div className="glass-panel rounded-2xl p-6 cinematic-shadow">
            <h3 className="font-display text-lg text-matte-black mb-1">Top Event Categories</h3>
            <p className="text-xs text-gray-400 font-light mb-4">Most booked event types</p>

            {stats.popularCategories?.length > 0 ? (
              <div className="space-y-4">
                {stats.popularCategories.map((cat, idx) => (
                  <div key={cat._id || idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-matte-black">{cat._id || 'General Event'}</span>
                      <span className="text-champagne-gold font-bold">{cat.count} bookings</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-champagne-gold to-amber-400 rounded-full"
                        style={{
                          width: `${Math.min(100, (cat.count / (stats.totalBookings || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-light py-4 text-center">No category data yet.</p>
            )}
          </div>

          {/* Platform Quick Controls */}
          <div className="glass-panel rounded-2xl p-6 cinematic-shadow">
            <h3 className="font-display text-lg text-matte-black mb-4">Quick Management Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/admin/events"
                className="flex items-center justify-between p-3 rounded-xl bg-matte-black text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
              >
                <span>Create / Edit Events</span>
                <span className="text-champagne-gold font-mono">→</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-sm font-medium text-matte-black"
              >
                <span>User Accounts ({stats.totalUsers || 0})</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/admin/messages"
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-sm font-medium text-matte-black"
              >
                <span>Unread Messages ({stats.unreadMessages || 0})</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/admin/analytics"
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-sm font-medium text-matte-black"
              >
                <span>View Full Analytics Report</span>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
