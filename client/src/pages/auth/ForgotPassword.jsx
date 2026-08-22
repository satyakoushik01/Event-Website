import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../api/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="p-8">
          {sent ? (
            <div className="text-center">
              <span className="text-4xl mb-4 block">📧</span>
              <h1 className="font-display text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-gray-500 mb-6">We&apos;ve sent password reset instructions to {email}</p>
              <Link to="/login"><Button>Back to Login</Button></Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-bold">Forgot Password</h1>
                <p className="text-sm text-gray-500 mt-1">Enter your email to receive reset instructions</p>
              </div>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                <Link to="/login" className="text-primary-600 hover:underline">Back to login</Link>
              </p>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
