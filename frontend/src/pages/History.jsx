import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { sessionAPI } from '../api/client';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await sessionAPI.getHistory();
        setSessions(res.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const emotionEmoji = {
    happy: '😊', sad: '😢', angry: '😠', fearful: '😨',
    disgusted: '🤢', surprised: '😲', neutral: '😐',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Session History</h2>
        <p className="text-gray-500 text-sm mb-8">Your past mindfulness sessions.</p>
        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No sessions yet. Start your first session to see your history.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{s.activity_title}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {emotionEmoji[s.emotion_detected] || '😐'} <span className="capitalize">{s.emotion_detected}</span> • {Math.round(s.confidence * 100)}% confidence
                  </p>
                  <p className="text-xs text-gray-300 mt-1">{new Date(s.started_at).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.completed ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}