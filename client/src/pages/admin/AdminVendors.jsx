import { useEffect, useState } from 'react';
import { getAllVendorsAdmin, updateVendorStatus } from '../../api/vendors';
import Loader from '../../components/ui/Loader';

const statusBadges = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/30',
  suspended: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
};

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchVendors = () => {
    setLoading(true);
    getAllVendorsAdmin()
      .then(({ data }) => setVendors(data.vendors || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateVendorStatus(id, status);
      fetchVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      v.category?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="glass-panel p-6 rounded-2xl cinematic-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-matte-black">Vendor Management</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Total {vendors.length} vendors listed across categories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search vendor or city..."
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
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((v) => (
            <div
              key={v._id}
              className="glass-panel p-5 rounded-2xl cinematic-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-champagne-gold/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <img
                  src={v.coverImage?.url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400'}
                  alt={v.businessName}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg text-matte-black font-semibold">{v.businessName}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusBadges[v.status] || ''}`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-light mt-1">
                    {v.category} • {v.location?.city || 'Location unavailable'}, {v.location?.state || ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    Email: {v.contactInfo?.email || 'N/A'} • Phone: {v.contactInfo?.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
                {v.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(v._id, 'approved')}
                      className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Approve Vendor
                    </button>
                    <button
                      onClick={() => handleStatusChange(v._id, 'rejected')}
                      className="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                {v.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(v._id, 'suspended')}
                    className="px-4 py-2 text-xs font-medium bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Suspend
                  </button>
                )}

                {v.status === 'suspended' && (
                  <button
                    onClick={() => handleStatusChange(v._id, 'approved')}
                    className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Reactivate
                  </button>
                )}

                {v.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(v._id, 'approved')}
                    className="px-4 py-2 text-xs font-medium bg-gray-800 text-white rounded-xl hover:bg-matte-black transition-colors"
                  >
                    Re-Approve
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-sm font-light">
            No vendors found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
