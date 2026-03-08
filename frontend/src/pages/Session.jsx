import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import { sessionAPI } from '../api/client';
import ActivityModal from '../components/ActivityModal';

const emotionActivities = {
  happy: { title: 'Loving Kindness Meditation', category: 'meditation', desc: 'Channel your positive energy into compassion for others.', color: 'bg-yellow-50 border-yellow-300' },
  sad: { title: 'Gratitude Reflection', category: 'meditation', desc: 'Gently shift focus to things that bring comfort and meaning.', color: 'bg-blue-50 border-blue-300' },
  angry: { title: 'Progressive Muscle Relaxation', category: 'movement', desc: 'Release tension by tensing and relaxing each muscle group.', color: 'bg-red-50 border-red-300' },
  fearful: { title: 'Box Breathing', category: 'breathing', desc: 'Regulate your nervous system with controlled breathing.', color: 'bg-green-50 border-green-300' },
  disgusted: { title: 'Body Scan Meditation', category: 'meditation', desc: 'Reconnect with your body through gentle awareness.', color: 'bg-purple-50 border-purple-300' },
  surprised: { title: '5-4-3-2-1 Grounding', category: 'grounding', desc: 'Ground yourself by engaging all five senses.', color: 'bg-orange-50 border-orange-300' },
  neutral: { title: 'Mindful Breathing', category: 'breathing', desc: 'A simple breath awareness practice to centre yourself.', color: 'bg-gray-50 border-gray-300' },
};

export default function Session() {
  const { videoRef, emotion, modelsLoaded, error, startDetection, startCamera, stopCamera } = useEmotionDetection();
  const [detecting, setDetecting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (emotion) {
      setCurrentEmotion(emotion);
      const activity = emotionActivities[emotion.type] || emotionActivities.neutral;
      setCurrentActivity(activity);

      if (!continuousMode) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDetecting(false);
      }
    }
  }, [emotion]);

  const handleStart = () => {
    setDetecting(true);
    setSaved(false);
    setCurrentEmotion(null);
    setCurrentActivity(null);
    intervalRef.current = startDetection(4000);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setDetecting(false);
  };

  const handleSave = async () => {
    if (!currentEmotion || !currentActivity) return;
    setSaving(true);
    try {
      const sessionData = {
        emotion_detected: currentEmotion.type,
        confidence: currentEmotion.confidence,
        activity_title: currentActivity.title,
        activity_category: currentActivity.category,
        completed: true,
      };
      await sessionAPI.startSession(JSON.stringify(sessionData));
      setSaved(true);
    } catch (err) {
      console.error('Failed to save session:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Live Session</h2>
        <p className="text-gray-500 mb-6 text-sm">Look into your camera. We'll detect your emotion and recommend the right activity.</p>

        {/* Detection Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Detection Mode</p>
            <p className="text-xs text-gray-400 mt-1">
              {continuousMode ? 'Continuous — updates emotion in real time' : 'Single — stops after first detection'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setContinuousMode(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!continuousMode ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Single
            </button>
            <button
              onClick={() => setContinuousMode(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${continuousMode ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Continuous
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">{error}</div>}

        {/* Camera */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <video ref={videoRef} autoPlay muted className="w-full rounded-t-2xl" style={{ maxHeight: '340px', objectFit: 'cover' }} />
          <div className="p-4 flex justify-between items-center">
            <div>
              {!modelsLoaded && <p className="text-sm text-gray-400">⏳ Loading emotion models...</p>}
              {modelsLoaded && !detecting && !currentEmotion && <p className="text-sm text-gray-400">✅ Models ready. Press Start to begin.</p>}
              {detecting && !currentEmotion && <p className="text-sm text-blue-500 animate-pulse">🔍 Analysing your expression...</p>}
              {detecting && currentEmotion && continuousMode && <p className="text-sm text-blue-500 animate-pulse">🔄 Continuously detecting...</p>}
              {currentEmotion && !detecting && <p className="text-sm text-green-600 font-medium">😊 Detected: <span className="capitalize">{currentEmotion.type}</span> ({Math.round(currentEmotion.confidence * 100)}%)</p>}
              {currentEmotion && detecting && continuousMode && <p className="text-sm text-green-600 font-medium">😊 Current: <span className="capitalize">{currentEmotion.type}</span> ({Math.round(currentEmotion.confidence * 100)}%)</p>}
            </div>
            <div className="flex gap-2">
              {modelsLoaded && !detecting && (
                <button onClick={handleStart} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-700 transition">
                  Start
                </button>
              )}
              {detecting && (
                <button onClick={handleStop} className="bg-red-500 text-white px-5 py-2 rounded-xl text-sm hover:bg-red-400 transition">
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {currentActivity && (
          <div className={`border-2 rounded-2xl p-6 ${currentActivity.color}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Recommended for you</h3>
            <h4 className="text-xl font-semibold text-blue-900">{currentActivity.title}</h4>
            <p className="text-gray-600 mt-2">{currentActivity.desc}</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowActivity(true)}
                className="bg-blue-900 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
              >
                Begin Activity
              </button>
              {!saved ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-white border border-blue-900 text-blue-900 px-6 py-2 rounded-xl text-sm hover:bg-blue-50 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Session'}
                </button>
              ) : (
                <span className="text-green-600 text-sm font-medium self-center">✅ Session saved!</span>
              )}
            </div>
          </div>
        )}
      </div>

      {showActivity && currentActivity && (
        <ActivityModal
          activity={currentActivity}
          onClose={() => setShowActivity(false)}
        />
      )}
    </div>
  );
}