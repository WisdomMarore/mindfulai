import { useState, useEffect, useRef } from 'react';

const activitySteps = {
  'Box Breathing': [
    'Sit comfortably and close your eyes',
    'Inhale slowly through your nose for 4 seconds',
    'Hold your breath for 4 seconds',
    'Exhale slowly through your mouth for 4 seconds',
    'Hold for 4 seconds before next breath',
    'Repeat this cycle 4 more times',
  ],
  'Loving Kindness Meditation': [
    'Sit comfortably and close your eyes',
    'Take 3 deep breaths to settle in',
    'Think of someone you love — feel warmth in your chest',
    'Silently repeat: May you be happy. May you be healthy.',
    'Now extend that feeling to yourself',
    'Finally extend it to all people around you',
  ],
  'Gratitude Reflection': [
    'Find a quiet comfortable position',
    'Close your eyes and take 3 deep breaths',
    'Think of one person you are grateful for and why',
    'Think of one experience you are grateful for',
    'Think of one simple thing you are grateful for today',
    'Sit with this feeling of gratitude for a moment',
  ],
  'Progressive Muscle Relaxation': [
    'Lie down or sit comfortably',
    'Tense your feet muscles tightly for 5 seconds',
    'Release and notice the relaxation for 10 seconds',
    'Move up to your legs — tense for 5 seconds then release',
    'Continue up through your stomach, arms, and shoulders',
    'Finally tense your face muscles then fully release',
  ],
  'Body Scan Meditation': [
    'Lie down comfortably and close your eyes',
    'Bring attention to the top of your head',
    'Slowly move awareness down to your face and neck',
    'Notice your shoulders, arms and hands',
    'Bring attention to your chest and stomach',
    'Finally scan down through your legs to your feet',
  ],
  '5-4-3-2-1 Grounding': [
    'Look around and name 5 things you can see',
    'Notice 4 things you can physically feel right now',
    'Listen carefully for 3 things you can hear',
    'Identify 2 things you can smell',
    'Notice 1 thing you can taste',
    'Take a deep breath — you are present and safe',
  ],
  'Mindful Breathing': [
    'Sit comfortably with your back straight',
    'Close your eyes and breathe naturally',
    'Focus all attention on the sensation of breathing',
    'Notice your chest or belly rising and falling',
    'When your mind wanders gently bring it back to breath',
    'Continue for the remaining time',
  ],
};

export default function ActivityModal({ activity, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const steps = activitySteps[activity.title] || activitySteps['Mindful Breathing'];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setRunning(false);
    }
    return () => clearInterval(timerRef.current);
  }, [running, timeLeft]);

  const handleStartPause = () => setRunning((r) => !r);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">{activity.title}</h2>
            <span className="text-xs text-gray-400 capitalize">{activity.category}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-blue-900 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-blue-900">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={handleStartPause}
            className="bg-blue-900 text-white px-8 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
          >
            {running ? 'Pause' : timeLeft === 300 ? 'Start' : 'Resume'}
          </button>
        </div>

        {/* Steps */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-6">
          <p className="text-xs text-blue-400 font-medium mb-2">
            STEP {currentStep + 1} OF {steps.length}
          </p>
          <p className="text-gray-700 font-medium">{steps[currentStep]}</p>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            ← Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-blue-900 text-white text-sm hover:bg-blue-700 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-500 transition"
            >
              ✅ Complete
            </button>
          )}
        </div>

      </div>
    </div>
  );
}