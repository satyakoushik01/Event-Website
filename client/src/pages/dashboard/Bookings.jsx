import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../../api/bookings';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const statusColor = { pending: 'yellow', confirmed: 'green', cancelled: 'red', completed: 'purple', 'in-progress': 'purple' };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link key={b._id} to={`/dashboard/bookings/${b._id}`} className="block p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{b.vendor?.businessName}</p>
                  <p className="text-sm text-gray-500">{b.eventType}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
                <div className="text-right">
                  <Badge color={statusColor[b.status] || 'gray'}>{b.status}</Badge>
                  <p className="text-sm font-medium text-primary-600 mt-2">₹{b.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
