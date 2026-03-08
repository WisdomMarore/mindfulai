const tierConfig = {
  1: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: '✅',
    title: 'You are doing well',
    textColor: 'text-green-800',
    buttonColor: 'bg-green-600 hover:bg-green-500',
  },
  2: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    icon: '⚠️',
    title: 'Mild Concern Detected',
    textColor: 'text-yellow-800',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-400',
  },
  3: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    icon: '🔶',
    title: 'We Are Concerned About You',
    textColor: 'text-orange-800',
    buttonColor: 'bg-orange-500 hover:bg-orange-400',
  },
  4: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    icon: '🚨',
    title: 'Immediate Support Recommended',
    textColor: 'text-red-800',
    buttonColor: 'bg-red-600 hover:bg-red-500',
  },
};

export default function EscalationAlert({ tier, message, onDismiss }) {
  if (!tier || tier === 1) return null;

  const config = tierConfig[tier];

  return (
    <div className={`fixed bottom-6 right-6 max-w-sm w-full border-2 rounded-2xl shadow-xl p-5 z-50 ${config.bg} ${config.border}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h4 className={`font-bold text-sm ${config.textColor}`}>{config.title}</h4>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <p className={`text-xs leading-relaxed mb-4 ${config.textColor}`}>{message}</p>
      {tier === 4 && (
        <div className={`text-xs font-semibold mb-3 ${config.textColor}`}>
          📞 Zimbabwe Crisis Line: <span className="underline">+263 4 792839</span>
        </div>
      )}
      <button
        onClick={onDismiss}
        className={`w-full text-white text-xs py-2 rounded-xl transition ${config.buttonColor}`}
      >
        I understand
      </button>
    </div>
  );
}