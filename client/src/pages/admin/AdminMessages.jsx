import { useEffect, useState } from 'react';
import { getMessages, updateMessage, deleteMessage } from '../../api/contact';
import Loader from '../../components/ui/Loader';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    getMessages()
      .then(({ data }) => setMessages(data.messages || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      await updateMessage(id, { status: 'read' });
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update message status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete message');
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl cinematic-shadow">
        <h2 className="font-display text-2xl text-matte-black">Client Inquiries & Messages</h2>
        <p className="text-xs text-gray-400 font-light mt-0.5">
          Total {messages.length} contact form submissions received
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m._id}
              className={`glass-panel p-6 rounded-2xl cinematic-shadow space-y-3 transition-all duration-300 ${
                m.status === 'unread' ? 'border-l-4 border-l-champagne-gold bg-amber-500/5' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-base text-matte-black">{m.subject}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    From: <span className="font-semibold text-matte-black">{m.name}</span> ({m.email}) • Phone: {m.phone || 'N/A'}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border self-start ${
                    m.status === 'unread'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/70 text-sm text-gray-700 leading-relaxed font-light">
                {m.message}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                <span>Received: {new Date(m.createdAt).toLocaleString()}</span>
                <div className="flex gap-2">
                  {m.status === 'unread' && (
                    <button
                      onClick={() => handleRead(m._id)}
                      className="px-3 py-1.5 bg-matte-black text-white rounded-lg hover:bg-zinc-800 font-medium transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-sm font-light">
            No contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
