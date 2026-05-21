import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(uid, token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset link has expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 100%)' }}>
      <div className="w-full max-w-md rounded-3xl p-8"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>

        <div className="text-center mb-8">
          <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
          <p className="text-blue-300 text-sm mt-1">Enter your new password below</p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-green-400 font-semibold mb-2">Password reset successfully!</p>
            <p className="text-blue-300 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-400 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-blue-300 text-xs font-medium mb-1 block">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-medium mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !password || !confirm}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-400 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-300 text-sm text-center hover:text-white transition"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}