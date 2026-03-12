import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { privacyAPI } from '../api/client';

export default function Privacy() {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await privacyAPI.downloadData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindfulai-data-${user?.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await privacyAPI.deleteAccount();
      localStorage.clear();
      setDeleted(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (deleted) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">✅</p>
        <h2 className="text-white text-xl font-bold mb-2">Account Deleted</h2>
        <p className="text-blue-300 text-sm">All your data has been permanently deleted.</p>
        <p className="text-blue-300 text-xs mt-2">Redirecting you to the home page...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10 flex-1">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Privacy & Data</h2>
          <p className="text-blue-300 text-sm mt-1">You are in full control of your data.</p>
        </div>

        {/* What We Store */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">What We Store</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: '✅', label: 'Emotion labels only', desc: 'e.g. "happy", "sad" — never your actual face or photo' },
              { icon: '✅', label: 'Activity history', desc: 'Which mindfulness activities you completed' },
              { icon: '✅', label: 'Confidence scores', desc: 'How confident the AI was in its detection' },
              { icon: '✅', label: 'Session timestamps', desc: 'When you completed each session' },
              { icon: '❌', label: 'No images ever', desc: 'Your camera feed never leaves your browser' },
              { icon: '❌', label: 'No biometric data', desc: 'We never store facial features or measurements' },
              { icon: '❌', label: 'No third party sharing', desc: 'Your data is never sold or shared with anyone' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 py-2 border-b border-white border-opacity-5 last:border-0">
                <span className="text-sm mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Data */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Download My Data</h3>
              <p className="text-blue-300 text-xs mt-0.5">Export all your session data as a JSON file</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            You have the right to access all data we hold about you. Download a complete copy of your session history, emotions detected and activities completed.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30 text-green-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-opacity-30 transition disabled:opacity-50"
          >
            {downloading ? 'Preparing download...' : '⬇ Download My Data'}
          </button>
        </div>

        {/* Delete Account */}
        <div className="bg-red-400 bg-opacity-10 border border-red-400 border-opacity-20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-300 font-semibold">Delete My Account</h3>
              <p className="text-red-300 text-opacity-70 text-xs mt-0.5">Permanently delete your account and all data</p>
            </div>
          </div>
          <p className="text-red-200 text-sm leading-relaxed mb-4" style={{ opacity: 0.8 }}>
            This will permanently delete your account, all session history, community posts and personal data. This action cannot be undone.
          </p>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-opacity-30 transition"
            >
              🗑 Delete My Account
            </button>
          ) : (
            <div className="bg-red-500 bg-opacity-10 border border-red-400 border-opacity-20 rounded-xl p-4">
              <p className="text-red-300 text-sm font-medium mb-3">Are you absolutely sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-400 transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-white bg-opacity-10 text-white px-6 py-2 rounded-xl text-sm hover:bg-opacity-20 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}