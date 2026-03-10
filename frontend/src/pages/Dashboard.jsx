import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { sessionAPI } from '../api/client';
import { escalationAPI } from '../api/client';
import EscalationAlert from '../components/EscalationAlert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import Footer from '../components/Footer';

const emotionColors = {
  happy: '#FBBF24', sad: '#60A5FA', angry: '#F87171',
  fearful: '#34D399', disgusted: '#A78BFA', surprised: '#FB923C', neutral: '#9CA3AF',
};

const emotionEmoji = {
  happy: '😊', sad: '😢', angry: '😠',
  fearful: '😨', disgusted: '🤢', surprised: '😲', neutral: '😐',
};

const positiveEmotions = ['happy', 'surprised'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [escalation, setEscalation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await sessionAPI.getHistory();
        setSessions(res.data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEscalation = async () => {
      try {
        const res = await escalationAPI.getEscalation();
        setEscalation(res.data);
        if (res.data.tier >= 2) setShowAlert(true);
      } catch (err) {
        console.error('Escalation check failed:', err);
      }
    };

    fetchSessions();
    fetchEscalation();
  }, []);

  const emotionCounts = sessions.reduce((acc, s) => {
    acc[s.emotion_detected] = (acc[s.emotion_detected] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
      key: emotion,
    }))
    .sort((a, b) => b.count - a.count);

  const trendData = [...sessions]
    .slice(0, 7)
    .reverse()
    .map((s, i) => ({
      name: `S${i + 1}`,
      confidence: Math.round(s.confidence * 100),
    }));

  const topEmotion = chartData[0];
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const positiveCount = sessions.filter(s => positiveEmotions.includes(s.emotion_detected)).length;
  const wellbeingScore = totalSessions > 0 ? Math.round((positiveCount / totalSessions) * 100) : 0;
  const recentSessions = sessions.slice(0, 3);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {user?.username} 👋
            </h2>
            <p className="text-blue-300 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => navigate('/session')}
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-400 transition text-sm"
          >
            + New Session
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-blue-500 bg-opacity-30 border border-blue-400 border-opacity-30 rounded-2xl p-6 col-span-2 md:col-span-1">
            <p className="text-blue-300 text-xs font-medium mb-2">WELLBEING SCORE</p>
            <p className="text-5xl font-bold text-white">{wellbeingScore}%</p>
            <p className="text-blue-300 text-xs mt-2">
              {wellbeingScore >= 50 ? '↑ Positive trend' : '↓ Could be better'}
            </p>
          </div>
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">TOTAL SESSIONS</p>
            <p className="text-4xl font-bold text-white">{totalSessions}</p>
            <p className="text-blue-300 text-xs mt-2">All time</p>
          </div>
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">COMPLETED</p>
            <p className="text-4xl font-bold text-green-400">{completedSessions}</p>
            <p className="text-blue-300 text-xs mt-2">
              {totalSessions > 0 ? `${Math.round((completedSessions / totalSessions) * 100)}% rate` : 'No sessions yet'}
            </p>
          </div>
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <p className="text-blue-300 text-xs font-medium mb-2">TOP EMOTION</p>
            <p className="text-3xl font-bold text-white">
              {topEmotion ? `${emotionEmoji[topEmotion.key]}` : '—'}
            </p>
            <p className="text-blue-300 text-xs mt-2 capitalize">
              {topEmotion ? `${topEmotion.emotion} (${topEmotion.count}x)` : 'No data yet'}
            </p>
          </div>
        </div>

        {/* Charts */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Emotion Frequency</h3>
              <p className="text-xs text-blue-300 mb-5">How often each emotion was detected</p>
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
              <h3 className="text-sm font-semibold text-white mb-1">Confidence Trend</h3>
              <p className="text-xs text-blue-300 mb-5">Last 7 sessions</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#93C5FD' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e3a5f', color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'Confidence']}
                  />
                  <Line type="monotone" dataKey="confidence" stroke="#60A5FA" strokeWidth={2.5} dot={{ fill: '#60A5FA', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Sessions + Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Sessions</h3>
              <button onClick={() => navigate('/history')} className="text-xs text-blue-300 hover:text-blue-200">
                View all
              </button>
            </div>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-blue-300">
                <p className="text-3xl mb-2">🧘</p>
                <p className="text-sm">No sessions yet. Start your first one!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center py-3 border-b border-white border-opacity-10 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emotionEmoji[s.emotion_detected] || '😐'}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{s.activity_title}</p>
                        <p className="text-xs text-blue-300 capitalize">{s.emotion_detected} • {Math.round(s.confidence * 100)}% confidence</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-300">{new Date(s.started_at).toLocaleDateString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.completed ? 'bg-green-400 bg-opacity-20 text-green-300' : 'bg-gray-400 bg-opacity-20 text-gray-300'}`}>
                        {s.completed ? 'Done' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-blue-500 bg-opacity-30 border border-blue-400 border-opacity-30 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="font-semibold text-white">Start a Session</h3>
              <p className="text-blue-200 text-xs">Detect your emotion and get a personalised activity.</p>
              <button
                onClick={() => navigate('/session')}
                className="bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-400 transition text-sm mt-2"
              >
                Begin Now →
              </button>
            </div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="font-semibold text-white">View History</h3>
              <p className="text-blue-300 text-xs">See all your past sessions and emotions.</p>
              <button
                onClick={() => navigate('/history')}
                className="border border-blue-400 border-opacity-50 text-blue-300 font-semibold py-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm mt-2"
              >
                View All →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    {showAlert && escalation && (
      <EscalationAlert
        tier={escalation.tier}
        message={escalation.message}
        onDismiss={() => setShowAlert(false)}
      />
    )}
    <Footer/>
    </>
  );
}