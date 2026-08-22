import { useEffect, useState } from 'react';
import { getAllVendorsAdmin, updateVendorStatus } from '../../api/vendors';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red', suspended: 'gray' };

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = () => {
    getAllVendorsAdmin()
      .then(({ data }) => setVendors(data.vendors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleStatus = async (id, status) => {
    await updateVendorStatus(id, status);
    fetchVendors();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">Vendors ({vendors.length})</h2>
      <div className="space-y-3">
        {vendors.map((v) => (
          <div key={v._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 gap-3">
            <div>
              <p className="font-medium">{v.businessName}</p>
              <p className="text-sm text-gray-500">{v.category} · {v.location?.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={statusColor[v.status]}>{v.status}</Badge>
              {v.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => handleStatus(v._id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleStatus(v._id, 'rejected')}>Reject</Button>
                </>
              )}
              {v.status === 'approved' && (
                <Button size="sm" variant="outline" onClick={() => handleStatus(v._id, 'suspended')}>Suspend</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
