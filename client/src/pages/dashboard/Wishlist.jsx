import { useEffect, useState } from 'react';
import { getWishlist } from '../../api/users';
import VendorCard from '../../components/vendors/VendorCard';
import Loader from '../../components/ui/Loader';
import Card from '../../components/ui/Card';

export default function Wishlist() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then(({ data }) => setVendors(data.wishlist || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Saved Vendors</h2>
      {vendors.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">No saved vendors yet. Browse the marketplace to add favorites.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {vendors.map((v, i) => (
            <VendorCard key={v._id} vendor={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
