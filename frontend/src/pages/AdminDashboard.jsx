import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { adminAPI } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import Footer from '../components/Footer';

const emotionColors = {
  happy: '#FBBF24', sad: '#60A5FA', angry: '#F87171',
  fearful: '#34D399', disgusted: '#A78BFA', surprised: '#FB923C', neutral: '#9CA3AF',
};

const tierConfig = {
  2: { label: 'Mild Concern', color: 'bg-yellow-400 bg-opacity-20 text-yellow-300 border-yellow-400 border-opacity-30' },
  3: { label: 'Moderate Concern', color: 'bg-orange-400 bg-opacity-20 text-orange-300 border-orange-400 border-opacity-30' },
  4: { label: 'Crisis', color: 'bg-red-400 bg-opacity-20 text-red-300 border-red-400 border-opacity-30' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, emotionRes, escalationRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getEmotionTrends(),
          adminAPI.getEscalations(),
        ]);
        setStats(statsRes.data);
        setEmotionData(emotionRes.data);
        setEscalations(escalationRes.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load admin data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await adminAPI.acknowledgeEscalation(id);
      setEscalations(escalations.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    }
  };

  const chartData = emotionData
    ? Object.entries(emotionData.emotion_counts).map(([emotion, count]) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        count,
        key: emotion,
      }))
    : [];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center">
      <p className="text-blue-300 animate-pulse">Loading admin dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-300 hover:text-blue-200 text-sm">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-blue-300 text-sm mt-1">System overview — anonymised data only.</p>
          </div>
          <span className="bg-purple-400 bg-opacity-20 text-purple-300 border border-purple-400 border-opacity-30 text-xs px-3 py-1 rounded-full">
            🔒 Admin Only
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-blue-500 bg-opacity-30 border border-blue-400 border-opacity-30 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">TOTAL USERS</p>
            <p className="text-4xl font-bold text-white">{stats.total_users}</p>
            <p className="text-blue-300 text-xs mt-2">+{stats.recent_users} this week</p>
          </div>
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">TOTAL SESSIONS</p>
            <p className="text-4xl font-bold text-white">{stats.total_sessions}</p>
            <p className="text-blue-300 text-xs mt-2">+{stats.recent_sessions} this week</p>
          </div>
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">COMPLETED</p>
            <p className="text-4xl font-bold text-green-400">{stats.completed_sessions}</p>
            <p className="text-blue-300 text-xs mt-2">
              {stats.total_sessions > 0 ? `${Math.round((stats.completed_sessions / stats.total_sessions) * 100)}% rate` : 'No sessions yet'}
            </p>
          </div>
          <div className={`border rounded-2xl p-6 ${stats.critical_escalations > 0 ? 'bg-red-400 bg-opacity-20 border-red-400 border-opacity-30' : 'bg-white bg-opacity-10 border-white border-opacity-10'}`}>
            <p className="text-blue-300 text-xs font-medium mb-2">ACTIVE ALERTS</p>
            <p className={`text-4xl font-bold ${stats.critical_escalations > 0 ? 'text-red-400' : 'text-white'}`}>
              {stats.critical_escalations + stats.high_escalations}
            </p>
            <p className="text-blue-300 text-xs mt-2">
              {stats.critical_escalations} critical
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Emotion Distribution</h3>
            <p className="text-xs text-blue-300 mb-5">Anonymised — across all users</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={32}>
                <XAxis dataKey="emotion" tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e3a5f', color: '#fff' }}
                  formatter={(value) => [`${value} sessions`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={emotionColors[entry.key] || '#60A5FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Daily Sessions</h3>
            <p className="text-xs text-blue-300 mb-5">Last 7 days</p>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <LineChart data={emotionData?.daily_sessions || []}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e3a5f', color: '#fff' }}
                  formatter={(value) => [`${value} sessions`, 'Sessions']}
                />
                <Line type="monotone" dataKey="sessions" stroke="#60A5FA" strokeWidth={2.5} dot={{ fill: '#60A5FA', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Escalation Alerts */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Active Escalation Alerts</h3>
              <p className="text-xs text-blue-300 mt-1">User identities are protected — no names shown</p>
            </div>
            <span className="text-xs text-blue-300">{escalations.length} unacknowledged</span>
          </div>

          {escalations.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">No active escalation alerts.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {escalations.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-2xl p-5 flex justify-between items-start ${tierConfig[alert.tier]?.color || ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tierConfig[alert.tier]?.color}`}>
                        Tier {alert.tier} — {tierConfig[alert.tier]?.label}
                      </span>
                      <span className="text-xs text-blue-300">
                        {new Date(alert.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-blue-100 leading-relaxed">{alert.message}</p>
                  </div>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="ml-4 bg-white bg-opacity-10 text-white text-xs px-4 py-2 rounded-xl hover:bg-opacity-20 transition border border-white border-opacity-10 shrink-0"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      < Footer/>
    </div>
  );
}