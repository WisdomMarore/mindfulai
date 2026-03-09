import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { sessionAPI } from '../api/client';

const emotionEmoji = {
  happy: '😊', sad: '😢', angry: '😠',
  fearful: '😨', disgusted: '🤢', surprised: '😲', neutral: '😐',
};

const emotionColors = {
  happy: 'bg-yellow-400 bg-opacity-20 text-yellow-300',
  sad: 'bg-blue-400 bg-opacity-20 text-blue-300',
  angry: 'bg-red-400 bg-opacity-20 text-red-300',
  fearful: 'bg-green-400 bg-opacity-20 text-green-300',
  disgusted: 'bg-purple-400 bg-opacity-20 text-purple-300',
  surprised: 'bg-orange-400 bg-opacity-20 text-orange-300',
  neutral: 'bg-gray-400 bg-opacity-20 text-gray-300',
};

const categoryColors = {
  breathing: 'bg-green-400 bg-opacity-20 text-green-300',
  meditation: 'bg-purple-400 bg-opacity-20 text-purple-300',
  movement: 'bg-orange-400 bg-opacity-20 text-orange-300',
  grounding: 'bg-yellow-400 bg-opacity-20 text-yellow-300',
};

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const emotions = ['all', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => s.emotion_detected === filter);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const avgConfidence = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.confidence, 0) / totalSessions * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Session History</h2>
          <p className="text-blue-300 text-sm mt-1">A full record of your mindfulness journey.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-5 text-center border border-white border-opacity-10">
            <p className="text-3xl font-bold text-white">{totalSessions}</p>
            <p className="text-xs text-blue-300 mt-1">Total Sessions</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-5 text-center border border-white border-opacity-10">
            <p className="text-3xl font-bold text-green-400">{completedSessions}</p>
            <p className="text-xs text-blue-300 mt-1">Completed</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-5 text-center border border-white border-opacity-10">
            <p className="text-3xl font-bold text-blue-300">{avgConfidence}%</p>
            <p className="text-xs text-blue-300 mt-1">Avg Confidence</p>
          </div>
        </div>

        {/* Filter by emotion */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {emotions.map((e) => (
            <button
              key={e}
              onClick={() => setFilter(e)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition ${
                filter === e
                  ? 'bg-blue-500 text-white'
                  : 'bg-white bg-opacity-10 text-blue-200 hover:bg-opacity-20 border border-white border-opacity-10'
              }`}
            >
              {e === 'all' ? 'All' : `${emotionEmoji[e]} ${e}`}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-16 text-blue-300">
            <p className="animate-pulse">Loading sessions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white bg-opacity-10 rounded-2xl p-12 text-center text-blue-300 border border-white border-opacity-10">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">No sessions found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-5 flex justify-between items-center hover:bg-opacity-20 transition border border-white border-opacity-10"
              >
                {/* Left — emotion + activity */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${emotionColors[s.emotion_detected] || 'bg-gray-400 bg-opacity-20 text-gray-300'}`}>
                    {emotionEmoji[s.emotion_detected] || '😐'}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{s.activity_title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-300 capitalize">{s.emotion_detected}</span>
                      <span className="text-blue-700">•</span>
                      <span className="text-xs text-blue-300">{Math.round(s.confidence * 100)}% confidence</span>
                      <span className="text-blue-700">•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${categoryColors[s.activity_category] || 'bg-gray-400 bg-opacity-20 text-gray-300'}`}>
                        {s.activity_category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right — date + status */}
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-blue-300">
                    {new Date(s.started_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-blue-300 mt-0.5">
                    {new Date(s.started_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    s.completed ? 'bg-green-400 bg-opacity-20 text-green-300' : 'bg-gray-400 bg-opacity-20 text-gray-300'
                  }`}>
                    {s.completed ? '✓ Done' : 'Incomplete'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}