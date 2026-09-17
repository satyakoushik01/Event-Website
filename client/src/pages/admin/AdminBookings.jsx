import { useEffect, useState } from 'react';
import { getAllBookingsAdmin, updateBookingStatus } from '../../api/bookings';
import Loader from '../../components/ui/Loader';

const statusBadges = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    getAllBookingsAdmin()
      .then(({ data }) => setBookings(data.bookings || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor?.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      b.eventType?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="glass-panel p-6 rounded-2xl cinematic-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-matte-black">Bookings Management</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Total {bookings.length} reservations recorded across events & vendors
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search client, vendor or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel p-6 rounded-2xl cinematic-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-champagne-gold/40 transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-matte-black text-champagne-gold rounded-lg">
                    #{b._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusBadges[b.status] || ''}`}>
                    {b.status}
                  </span>
                  <span className="text-xs text-gray-400 font-light">
                    Booked: {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Client</p>
                    <p className="text-sm font-medium text-matte-black">{b.user?.name || 'Guest User'}</p>
                    <p className="text-xs text-gray-500">{b.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Event / Vendor</p>
                    <p className="text-sm font-medium text-matte-black">{b.vendor?.businessName || b.eventType || 'Event Booking'}</p>
                    <p className="text-xs text-gray-500">Date: {new Date(b.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Amount</p>
                    <p className="text-base font-display font-semibold text-champagne-gold">
                      ₹{(b.totalAmount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">Payment: {b.paymentStatus || 'pending'}</p>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
                {b.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(b._id, 'confirmed')}
                    className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Confirm Booking
                  </button>
                )}

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange(b._id, 'completed')}
                    className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Mark Completed
                  </button>
                )}

                {!['cancelled', 'completed'].includes(b.status) && (
                  <button
                    onClick={() => handleStatusChange(b._id, 'cancelled')}
                    className="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-sm font-light">
            No bookings found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
