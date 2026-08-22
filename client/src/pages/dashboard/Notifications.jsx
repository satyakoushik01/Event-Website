import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/users';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    getNotifications()
      .then(({ data }) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    fetchNotifications();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Notifications {unreadCount > 0 && <span className="text-sm text-primary-600">({unreadCount} unread)</span>}</h2>
        {unreadCount > 0 && <Button size="sm" variant="ghost" onClick={handleReadAll}>Mark all read</Button>}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => !n.isRead && handleRead(n._id)}
              className={`w-full text-left p-4 rounded-xl transition-colors ${n.isRead ? 'bg-gray-50' : 'bg-primary-50 border border-primary-100'}`}
            >
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-xs text-gray-500 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
