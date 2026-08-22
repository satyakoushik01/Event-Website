import { useEffect, useState } from 'react';
import { getMessages, updateMessage, deleteMessage } from '../../api/contact';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    getMessages()
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRead = async (id) => {
    await updateMessage(id, { status: 'read' });
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
    fetchMessages();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">Contact Messages ({messages.length})</h2>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m._id} className={`p-4 rounded-xl border ${m.status === 'unread' ? 'border-primary-200 bg-primary-50/50' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{m.subject}</p>
                <p className="text-sm text-gray-500">{m.name} · {m.email}</p>
              </div>
              <Badge color={m.status === 'unread' ? 'purple' : 'gray'}>{m.status}</Badge>
            </div>
            <p className="text-sm text-gray-600">{m.message}</p>
            <div className="flex gap-2 mt-3">
              {m.status === 'unread' && <Button size="sm" onClick={() => handleRead(m._id)}>Mark Read</Button>}
              <Button size="sm" variant="danger" onClick={() => handleDelete(m._id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
