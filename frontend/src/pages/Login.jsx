import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
  setForgotError('');
  setForgotLoading(true);
  try {
    await authAPI.forgotPassword(forgotEmail);
    setForgotSent(true);
  } catch (err) {
    setForgotError('Something went wrong. Please try again.');
  } finally {
    setForgotLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await authAPI.login({
          username: form.username,
          password: form.password,
        });
        const token = res.data.access;
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify({ username: form.username }));
        navigate('/dashboard');
      } else {
        await authAPI.register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        setSuccess('Account created! You can now sign in.');
        setIsLogin(true);
        setForm({ username: '', email: '', password: '' });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-4">
        <div className="bg-blue-900 px-6 py-3 rounded-2xl">
         <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-12" />
        </div>
      </div>
        <p className="text-center text-gray-400 mb-6 text-sm">Your personalised mindfulness companion</p>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${isLogin ? 'bg-white shadow text-blue-900' : 'text-gray-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!isLogin ? 'bg-white shadow text-blue-900' : 'text-gray-400'}`}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            onClick={() => setShowForgot(true)}
              className="text-blue-300 text-xs hover:text-white transition text-right w-full"
            >
              Forgot password?
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
      {showForgot && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
    <div className="w-full max-w-md rounded-3xl p-8"
      style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a2744)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h3 className="text-white text-xl font-bold mb-2">Forgot Password</h3>
      <p className="text-blue-300 text-sm mb-6">Enter your email address and we will send you a reset link.</p>

      {forgotSent ? (
        <div className="text-center">
          <p className="text-4xl mb-3">📧</p>
          <p className="text-green-400 font-semibold mb-2">Reset link sent!</p>
          <p className="text-blue-300 text-sm mb-4">Check your email inbox for the reset link.</p>
          <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
            className="text-blue-300 text-sm hover:text-white transition">
            ← Back to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {forgotError && (
            <div className="bg-red-400 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300 rounded-xl p-3 text-sm">
              {forgotError}
            </div>
          )}
          <input
            type="email"
            placeholder="Your email address"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full bg-white bg-opacity-10 border border-white border-opacity-10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleForgotPassword}
            disabled={forgotLoading || !forgotEmail}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-400 transition disabled:opacity-50"
          >
            {forgotLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button onClick={() => setShowForgot(false)}
            className="text-blue-300 text-sm text-center hover:text-white transition">
            ← Back to Login
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}