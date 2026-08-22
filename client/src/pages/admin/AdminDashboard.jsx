import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/admin';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'text-primary-600' },
    { label: 'Approved Vendors', value: stats.totalVendors, color: 'text-green-600' },
    { label: 'Pending Vendors', value: stats.pendingVendors, color: 'text-yellow-600' },
    { label: 'Total Bookings', value: stats.totalBookings, color: 'text-blue-600' },
    { label: 'Pending Bookings', value: stats.pendingBookings, color: 'text-orange-600' },
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: 'text-gold-600' },
    { label: 'Pending Reviews', value: stats.pendingReviews, color: 'text-purple-600' },
    { label: 'Unread Messages', value: stats.unreadMessages, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </Card>
        ))}
      </div>

      {stats.recentBookings?.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Vendor</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50">
                    <td className="py-3">{b.user?.name}</td>
                    <td className="py-3">{b.vendor?.businessName}</td>
                    <td className="py-3 capitalize">{b.status}</td>
                    <td className="py-3">₹{b.totalAmount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
