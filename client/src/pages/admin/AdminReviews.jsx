import { useEffect, useState } from 'react';
import { getAllReviewsAdmin, moderateReview } from '../../api/reviews';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import Loader from '../../components/ui/Loader';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    getAllReviewsAdmin()
      .then(({ data }) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleModerate = async (id, status) => {
    await moderateReview(id, status);
    fetchReviews();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">Reviews ({reviews.length})</h2>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{r.user?.name} on {r.vendor?.businessName}</p>
                <StarRating rating={r.rating} />
              </div>
              <Badge color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'yellow'}>{r.status}</Badge>
            </div>
            {r.title && <p className="font-medium text-sm">{r.title}</p>}
            <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
            {r.status === 'pending' && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => handleModerate(r._id, 'approved')}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => handleModerate(r._id, 'rejected')}>Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
