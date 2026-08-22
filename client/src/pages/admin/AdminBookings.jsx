import { useEffect, useState } from 'react';
import { getAllBookingsAdmin, updateBookingStatus } from '../../api/bookings';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const statusColor = { pending: 'yellow', confirmed: 'green', cancelled: 'red', completed: 'purple', 'in-progress': 'purple' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    getAllBookingsAdmin()
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    fetchBookings();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">Bookings ({bookings.length})</h2>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 rounded-xl border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{b.vendor?.businessName}</p>
                <p className="text-sm text-gray-500">{b.user?.name} · {b.eventType} · {new Date(b.eventDate).toLocaleDateString()}</p>
                <p className="text-sm font-medium text-primary-600 mt-1">₹{b.totalAmount?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={statusColor[b.status]}>{b.status}</Badge>
                {b.status === 'pending' && (
                  <Button size="sm" onClick={() => handleStatus(b._id, 'confirmed')}>Confirm</Button>
                )}
                {b.status === 'confirmed' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus(b._id, 'completed')}>Complete</Button>
                )}
                {!['cancelled', 'completed'].includes(b.status) && (
                  <Button size="sm" variant="danger" onClick={() => handleStatus(b._id, 'cancelled')}>Cancel</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
