import { useEffect, useRef, useState } from 'react';

const activitySteps = {
  'Box Breathing': [
    'Find a comfortable position and close your eyes.',
    'Inhale slowly through your nose for 4 counts.',
    'Hold your breath for 4 counts.',
    'Exhale slowly through your mouth for 4 counts.',
    'Hold again for 4 counts.',
    'Repeat this cycle and feel your body relax.',
  ],
  'Loving Kindness Meditation': [
    'Sit comfortably and close your eyes.',
    'Take three deep breaths to settle in.',
    'Bring to mind someone you love deeply.',
    'Silently repeat — may you be happy, may you be healthy.',
    'Now extend that wish to yourself.',
    'Finally extend it to all living beings around you.',
  ],
  'Gratitude Reflection': [
    'Find a quiet space and take a deep breath.',
    'Think of one person who has positively impacted your life.',
    'Recall one moment today that brought you comfort.',
    'Identify one thing about your body you are grateful for.',
    'Notice how gratitude feels in your chest right now.',
    'Carry this feeling with you as you return to your day.',
  ],
  'Progressive Muscle Relaxation': [
    'Lie down or sit comfortably.',
    'Take a deep breath and tense your feet for 5 seconds.',
    'Release and notice the relaxation spreading.',
    'Move up to your legs — tense them for 5 seconds then release.',
    'Tense your shoulders up to your ears, then release.',
    'Finally tense your whole body at once, then release completely.',
  ],
  'Body Scan Meditation': [
    'Lie down and close your eyes.',
    'Bring your attention to the top of your head.',
    'Slowly move awareness down to your face and jaw.',
    'Notice your shoulders — let them drop and soften.',
    'Scan down through your chest, belly and lower back.',
    'Finally bring awareness to your feet and let go completely.',
  ],
  '5-4-3-2-1 Grounding': [
    'Look around and name 5 things you can see.',
    'Now notice 4 things you can physically touch.',
    'Listen carefully for 3 things you can hear.',
    'Identify 2 things you can smell right now.',
    'Finally notice 1 thing you can taste.',
    'Take a deep breath. You are safe and grounded.',
  ],
  'Mindful Breathing': [
    'Sit comfortably and gently close your eyes.',
    'Breathe in naturally and follow the breath in.',
    'Notice the pause between inhale and exhale.',
    'Breathe out and follow the breath all the way out.',
    'If your mind wanders, gently return to the breath.',
    'Continue breathing and simply be present in this moment.',
  ],
};

export default function ActivityModal({ activity, onClose }) {
  const steps = activitySteps[activity.title] || activitySteps['Mindful Breathing'];
  const stepDuration = Math.floor((5 * 60) / steps.length);

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const intervalRef = useRef(null);
  const stepIntervalRef = useRef(null);

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Female') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Google UK English Female')
    );
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const playCompletionSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.3);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.3 + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.3 + 0.6);
      oscillator.start(ctx.currentTime + i * 0.3);
      oscillator.stop(ctx.currentTime + i * 0.3 + 0.6);
    });
  };

  const handleStart = () => {
    setStarted(true);

    const startSpeech = () => {
      speak(`Starting ${activity.title}. ${steps[0]}`);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeech;
    } else {
      startSpeech();
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(stepIntervalRef.current);
          setFinished(true);
          playCompletionSound();
          setTimeout(() => {
            speak('Well done. Your session is complete. Take a moment to appreciate yourself.');
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let step = 0;
    const scheduleNextStep = () => {
      stepIntervalRef.current = setTimeout(() => {
        step += 1;
        if (step < steps.length) {
          setCurrentStep(step);
          setTimeout(() => speak(steps[step]), 500);
          scheduleNextStep();
        }
      }, stepDuration * 1000);
    };
    scheduleNextStep();
  };

  const handleClose = () => {
    clearInterval(intervalRef.current);
    clearInterval(stepIntervalRef.current);
    window.speechSynthesis.cancel();
    onClose();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(stepIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>

      <div className="w-full max-w-md rounded-3xl relative flex flex-col"
        style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a2744)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh' }}>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-8 flex-1">

          {/* Close */}
          <button onClick={handleClose} className="absolute top-4 right-4 text-blue-300 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Activity</p>
            <h3 className="text-white text-xl font-bold">{activity.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full capitalize mt-1 inline-block bg-blue-500 bg-opacity-20 text-blue-300 border border-blue-400 border-opacity-20">
              {activity.category}
            </span>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <p className={`text-6xl font-bold mb-2 ${timeLeft <= 30 && started ? 'text-red-400' : 'text-white'}`}>
              {started ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : '05:00'}
            </p>
            <div className="w-full rounded-full h-1.5 mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-1000"
                style={{ width: started ? `${progress}%` : '0%', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
              />
            </div>
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                window.speechSynthesis.cancel();
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                voiceEnabled
                  ? 'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-400 border-opacity-30'
                  : 'bg-white bg-opacity-5 text-gray-400 border-white border-opacity-10'
              }`}
            >
              {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
            </button>
          </div>

          {/* Steps */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-blue-300 text-xs font-medium uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </p>
              {speaking && (
                <span className="text-blue-400 text-xs animate-pulse">🔊 Speaking...</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-start p-3 rounded-xl transition-all ${
                    i === currentStep
                      ? 'bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30'
                      : i < currentStep
                      ? 'opacity-40'
                      : 'opacity-20'
                  }`}
                >
                  <span className={`text-xs font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    i < currentStep ? 'bg-green-500 text-white' :
                    i === currentStep ? 'bg-blue-500 text-white' :
                    'bg-white bg-opacity-10 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </span>
                  <p className={`text-sm leading-relaxed ${i === currentStep ? 'text-white' : 'text-blue-300'}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actions — always visible at bottom */}
        <div className="px-8 pb-8 pt-4 border-t border-white border-opacity-10">
          {finished ? (
            <div className="text-center">
              <p className="text-green-400 font-semibold mb-4">🎉 Session Complete! Well done.</p>
              <button onClick={handleClose}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-400 transition">
                Close
              </button>
            </div>
          ) : !started ? (
            <button onClick={handleStart}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-400 transition">
              Begin Activity
            </button>
          ) : (
            <button onClick={handleClose}
              className="w-full bg-white bg-opacity-10 text-white py-3 rounded-xl font-medium hover:bg-opacity-20 transition border border-white border-opacity-10">
              End Early
            </button>
          )}
        </div>

      </div>
    </div>
  );
}