import { useEffect, useState } from 'react';
import { getAllReviewsAdmin, moderateReview } from '../../api/reviews';
import StarRating from '../../components/ui/StarRating';
import Loader from '../../components/ui/Loader';

const statusBadges = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = () => {
    setLoading(true);
    getAllReviewsAdmin()
      .then(({ data }) => setReviews(data.reviews || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id, status) => {
    try {
      await moderateReview(id, status);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update review status');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    return statusFilter === 'all' || r.status === statusFilter;
  });

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl cinematic-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-matte-black">Reviews Moderation</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Total {reviews.length} reviews submitted by clients
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold bg-white"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending Moderation</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div key={r._id} className="glass-panel p-6 rounded-2xl cinematic-shadow space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-sm text-matte-black">
                    {r.user?.name || 'Anonymous User'} evaluated <span className="text-champagne-gold font-semibold">{r.vendor?.businessName || 'Vendor'}</span>
                  </h3>
                  <div className="mt-1">
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border self-start ${statusBadges[r.status] || ''}`}>
                  {r.status}
                </span>
              </div>

              {r.title && <p className="font-medium text-sm text-matte-black">{r.title}</p>}
              <p className="text-sm text-gray-600 font-light leading-relaxed">{r.comment}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(r._id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
                    >
                      Approve Review
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerate(r._id, 'rejected')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                    >
                      Reject Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-sm font-light">
            No reviews found matching the status filter.
          </div>
        )}
      </div>
    </div>
  );
}
