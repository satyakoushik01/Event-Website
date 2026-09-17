import { useEffect, useState } from 'react';
import { getRegisteredUsers, deleteRegisteredUser } from '../../utils/localAuth';
import Loader from '../../components/ui/Loader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = () => {
    setLoading(true);
    const users = getRegisteredUsers();
    setUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;
    try {
      await deleteRegisteredUser(email);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="glass-panel p-6 rounded-2xl cinematic-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-matte-black">User Accounts Management</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Total {users.length} registered accounts across the platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold w-full sm:w-64"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-champagne-gold bg-white"
          >
            <option value="all">All Roles</option>
            <option value="user">User Only</option>
            <option value="admin">Admin Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl p-6 cinematic-shadow">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Verification</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <tr key={u.email} className="hover:bg-white/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-matte-black text-champagne-gold flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-matte-black">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.phone || 'No phone provided'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-gray-600 font-mono text-xs">{u.email}</td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-champagne-gold/20 text-matte-black border border-champagne-gold/40'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4">
                      {u.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 text-right">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleDelete(u.email, u.name)}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm font-light">
            No users found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
