import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import { sessionAPI } from '../api/client';
import ActivityModal from '../components/ActivityModal';
import Footer from '../components/Footer';

const emotionActivities = {
  happy: { title: 'Loving Kindness Meditation', category: 'meditation', desc: 'Channel your positive energy into compassion for others.', color: 'border-yellow-400 border-opacity-40' },
  sad: { title: 'Gratitude Reflection', category: 'meditation', desc: 'Gently shift focus to things that bring comfort and meaning.', color: 'border-blue-400 border-opacity-40' },
  angry: { title: 'Progressive Muscle Relaxation', category: 'movement', desc: 'Release tension by tensing and relaxing each muscle group.', color: 'border-red-400 border-opacity-40' },
  fearful: { title: 'Box Breathing', category: 'breathing', desc: 'Regulate your nervous system with controlled breathing.', color: 'border-green-400 border-opacity-40' },
  disgusted: { title: 'Body Scan Meditation', category: 'meditation', desc: 'Reconnect with your body through gentle awareness.', color: 'border-purple-400 border-opacity-40' },
  surprised: { title: '5-4-3-2-1 Grounding', category: 'grounding', desc: 'Ground yourself by engaging all five senses.', color: 'border-orange-400 border-opacity-40' },
  neutral: { title: 'Mindful Breathing', category: 'breathing', desc: 'A simple breath awareness practice to centre yourself.', color: 'border-gray-400 border-opacity-40' },
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
  const [recommendationMethod, setRecommendationMethod] = useState(null);
  const [sessionsUntilML, setSessionsUntilML] = useState(null);

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
    if (!continuousMode) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDetecting(false);
    }
    fetchRecommendation(emotion.type);
  }
}, [emotion]);

const fetchRecommendation = async (emotionType) => {
  try {
    const res = await sessionAPI.getRecommendation(emotionType);
    setCurrentActivity({
      title: res.data.activity_title,
      category: res.data.activity_category,
      desc: emotionActivities[emotionType]?.desc || 'A mindfulness activity recommended for you.',
      color: emotionActivities[emotionType]?.color || 'border-blue-400 border-opacity-40',
    });
    setRecommendationMethod(res.data.method);
    setSessionsUntilML(res.data.sessions_until_ml);
  } catch (err) {
    console.error('Recommendation failed:', err);
    const activity = emotionActivities[emotionType] || emotionActivities.neutral;
    setCurrentActivity(activity);
  }
};

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
      await sessionAPI.startSession({
        emotion_detected: currentEmotion.type,
        confidence: currentEmotion.confidence,
        activity_title: currentActivity.title,
        activity_category: currentActivity.category,
        completed: true,
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to save session:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Live Session</h2>
          <p className="text-blue-300 text-sm mt-1">Look into your camera. We'll detect your emotion and recommend the right activity.</p>
        </div>

        {/* Detection Mode Toggle */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Detection Mode</p>
            <p className="text-xs text-blue-300 mt-1">
              {continuousMode ? 'Continuous — updates emotion in real time' : 'Single — stops after first detection'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setContinuousMode(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!continuousMode ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-blue-300 hover:bg-opacity-20'}`}
            >
              Single
            </button>
            <button
              onClick={() => setContinuousMode(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${continuousMode ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-blue-300 hover:bg-opacity-20'}`}
            >
              Continuous
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-400 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Camera */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl overflow-hidden mb-6">
          <video ref={videoRef} autoPlay muted className="w-full" style={{ maxHeight: '340px', objectFit: 'cover' }} />
          <div className="p-4 flex justify-between items-center">
            <div>
              {!modelsLoaded && <p className="text-sm text-blue-300">⏳ Loading emotion models...</p>}
              {modelsLoaded && !detecting && !currentEmotion && <p className="text-sm text-blue-300">✅ Models ready. Press Start to begin.</p>}
              {detecting && !currentEmotion && <p className="text-sm text-blue-300 animate-pulse">🔍 Analysing your expression...</p>}
              {detecting && currentEmotion && continuousMode && <p className="text-sm text-blue-300 animate-pulse">🔄 Continuously detecting...</p>}
              {currentEmotion && !detecting && (
                <p className="text-sm text-green-400 font-medium">
                  😊 Detected: <span className="capitalize">{currentEmotion.type}</span> ({Math.round(currentEmotion.confidence * 100)}%)
                </p>
              )}
              {currentEmotion && detecting && continuousMode && (
                <p className="text-sm text-green-400 font-medium">
                  😊 Current: <span className="capitalize">{currentEmotion.type}</span> ({Math.round(currentEmotion.confidence * 100)}%)
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {modelsLoaded && !detecting && (
                <button onClick={handleStart} className="bg-blue-500 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-400 transition">
                  Start
                </button>
              )}
              {detecting && (
                <button onClick={handleStop} className="bg-red-500 bg-opacity-50 text-red-200 px-5 py-2 rounded-xl text-sm hover:bg-opacity-70 transition">
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {currentActivity && (
          <div className={`bg-white bg-opacity-10 border-2 rounded-2xl p-6 ${currentActivity.color}`}>
            <div className="flex justify-between items-center mb-1">
  <p className="text-xs text-blue-300 font-medium">RECOMMENDED FOR YOU</p>
  {recommendationMethod && (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${
      recommendationMethod === 'ml'
        ? 'bg-purple-400 bg-opacity-20 text-purple-300 border-purple-400 border-opacity-30'
        : 'bg-blue-400 bg-opacity-20 text-blue-300 border-blue-400 border-opacity-30'
    }`}>
      {recommendationMethod === 'ml' ? '🤖 ML Powered' : `📊 Rule Based · ${sessionsUntilML} sessions until ML`}
    </span>
  )}
</div>
            <h4 className="text-xl font-semibold text-white mb-2">{currentActivity.title}</h4>
            <p className="text-blue-200 text-sm">{currentActivity.desc}</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowActivity(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-400 transition"
              >
                Begin Activity
              </button>
              {!saved ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-6 py-2 rounded-xl text-sm hover:bg-opacity-20 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Session'}
                </button>
              ) : (
                <span className="text-green-400 text-sm font-medium self-center">✅ Session saved!</span>
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
        <Footer/>
    </div>
    
  );
  
}