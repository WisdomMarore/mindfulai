export default function MindfulCard({ title, description, duration, category, onStart }) {
  const categoryColors = {
    breathing: 'bg-blue-100 text-blue-800',
    meditation: 'bg-purple-100 text-purple-800',
    movement: 'bg-green-100 text-green-800',
    grounding: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-600'}`}>
          {category}
        </span>
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">⏱ {duration} min</span>
        <button
          onClick={onStart}
          className="bg-blue-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}