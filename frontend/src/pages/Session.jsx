import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useEmotionDetection } from '../hooks/useEmotionDetection';

const emotionActivities = {
  happy: { title: 'Loving Kindness Meditation', desc: 'Channel your positive energy into compassion for others.', color: 'bg-yellow-50 border-yellow-300' },
  sad: { title: 'Gratitude Reflection', desc: 'Gently shift focus to things that bring comfort and meaning.', color: 'bg-blue-50 border-blue-300' },
  angry: { title: 'Progressive Muscle Relaxation', desc: 'Release tension by tensing and relaxing each muscle group.', color: 'bg-red-50 border-red-300' },
  fearful: { title: 'Box Breathing', desc: 'Regulate your nervous system with controlled breathing.', color: 'bg-green-50 border-green-300' },
  disgusted: { title: 'Body Scan Meditation', desc: 'Reconnect with your body through gentle awareness.', color: 'bg-purple-50 border-purple-300' },
  surprised: { title: '5-4-3-2-1 Grounding', desc: 'Ground yourself by engaging all five senses.', color: 'bg-orange-50 border-orange-300' },
  neutral: { title: 'Mindful Breathing', desc: 'A simple breath awareness practice to centre yourself.', color: 'bg-gray-50 border-gray-300' },
};

export default function Session() {
  const { videoRef, emotion, modelsLoaded, error, startDetection, startCamera } = useEmotionDetection();
  const [detecting, setDetecting] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleStart = () => {
    setDetecting(true);
    intervalRef.current = startDetection(2000);
  };

  const activity = emotion ? emotionActivities[emotion.type] || emotionActivities.neutral : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Live Session</h2>
        <p className="text-gray-500 mb-8 text-sm">Look into your camera. We'll detect your emotion and recommend the right activity.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">{error}</div>}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <video ref={videoRef} autoPlay muted className="w-full rounded-t-2xl" style={{ maxHeight: '340px', objectFit: 'cover' }} />
          <div className="p-4 flex justify-between items-center">
            <div>
              {!modelsLoaded && <p className="text-sm text-gray-400">⏳ Loading emotion models...</p>}
              {modelsLoaded && !detecting && <p className="text-sm text-gray-400">✅ Models ready. Press Start to begin.</p>}
              {detecting && !emotion && <p className="text-sm text-blue-500 animate-pulse">🔍 Analysing your expression...</p>}
              {emotion && <p className="text-sm text-green-600 font-medium">😊 Detected: <span className="capitalize">{emotion.type}</span> ({Math.round(emotion.confidence * 100)}%)</p>}
            </div>
            {modelsLoaded && !detecting && (
              <button onClick={handleStart} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-700 transition">
                Start Detection
              </button>
            )}
          </div>
        </div>
        {activity && (
          <div className={`border-2 rounded-2xl p-6 ${activity.color}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Recommended for you</h3>
            <h4 className="text-xl font-semibold text-blue-900">{activity.title}</h4>
            <p className="text-gray-600 mt-2">{activity.desc}</p>
            <button className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition">
              Begin Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}