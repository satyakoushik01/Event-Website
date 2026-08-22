import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../../api/auth';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    verifyEmail(token)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendMsg('');
    try {
      const { data } = await resendVerification(resendEmail);
      setResendSuccess(true);
      setResendMsg(data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <Card className="p-8 w-full max-w-md text-center">
        {status === 'loading' && <Loader />}

        {status === 'success' && (
          <>
            <span className="text-5xl mb-4 block">✅</span>
            <h1 className="font-display text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login"><Button>Continue to Login</Button></Link>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="text-5xl mb-4 block">❌</span>
            <h1 className="font-display text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">{message}</p>

            {!resendSuccess ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your email address below to receive a new verification link.
                </p>
                <form onSubmit={handleResend} className="space-y-3 text-left">
                  <Input
                    label="Email Address"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                  {resendMsg && (
                    <p className="text-sm text-red-600">{resendMsg}</p>
                  )}
                  <Button type="submit" loading={resending} className="w-full">
                    Resend Verification Link
                  </Button>
                </form>
                <div className="mt-4">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">Back to Login</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-4">
                  <span className="text-2xl block mb-2">📧</span>
                  <p className="text-sm text-green-700 font-medium">{resendMsg}</p>
                  <p className="text-xs text-green-600 mt-1">Check your inbox and spam folder.</p>
                </div>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
