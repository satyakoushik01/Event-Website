import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../api/admin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    getUsers()
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await deleteUser(id);
    fetchUsers();
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">Users ({users.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Verified</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50">
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-gray-500">{u.email}</td>
                <td className="py-3"><Badge color={u.role === 'admin' ? 'gold' : 'purple'}>{u.role}</Badge></td>
                <td className="py-3">{u.isEmailVerified ? '✅' : '❌'}</td>
                <td className="py-3">
                  {u.role !== 'admin' && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>Delete</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
