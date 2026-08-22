import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword } from '../../api/users';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleAvatarUpload = (url) => {
    setProfile((prev) => ({ ...prev, avatar: url }));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg('');
    try {
      await updateProfile(profile);
      await refreshUser();
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPassMsg('');
    try {
      const { data } = await updatePassword(passwords);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setPassMsg('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPassMsg(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload Card */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-5">Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ImageUpload
            currentUrl={profile.avatar}
            onUpload={handleAvatarUpload}
            shape="circle"
            placeholder="Upload photo"
          />
          <div className="text-center sm:text-left">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-3 max-w-xs">
              Upload a clear, professional photo. This will appear on your bookings and reviews.
            </p>
            {profile.avatar && profile.avatar !== user?.avatar && (
              <p className="text-xs text-amber-600 mt-2">⚠ Save your profile below to apply the new photo.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Info Card */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-4">Profile Information</h2>
        {profileMsg && (
          <p className={`text-sm mb-4 ${profileMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {profileMsg}
          </p>
        )}
        <form onSubmit={handleProfile} className="space-y-4 max-w-md">
          <Input label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Input label="Email" value={user?.email || ''} disabled />
          <Input label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-4">Change Password</h2>
        {passMsg && (
          <p className={`text-sm mb-4 ${passMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {passMsg}
          </p>
        )}
        <form onSubmit={handlePassword} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
            minLength={6}
          />
          <Button type="submit" variant="outline" loading={loading}>Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
