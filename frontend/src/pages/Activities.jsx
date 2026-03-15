import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const activities = [
  { id: 1, title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s. Calms anxiety fast.', duration: 5, category: 'breathing' },
  { id: 2, title: 'Body Scan', description: 'Slowly bring awareness to each part of your body.', duration: 10, category: 'meditation' },
  { id: 3, title: 'Gratitude Reflection', description: 'Think of 3 things you are grateful for right now.', duration: 5, category: 'meditation' },
  { id: 4, title: 'Progressive Muscle Relaxation', description: 'Tense and release each muscle group to release stress.', duration: 15, category: 'movement' },
  { id: 5, title: '5-4-3-2-1 Grounding', description: 'Engage all five senses to ground yourself.', duration: 5, category: 'grounding' },
  { id: 6, title: 'Loving Kindness Meditation', description: 'Extend compassion to yourself and others.', duration: 10, category: 'meditation' },
  { id: 7, title: 'Mindful Breathing', description: 'Focus purely on the sensation of breathing.', duration: 5, category: 'breathing' },
];

const categoryColors = {
  breathing: 'bg-green-400 bg-opacity-20 text-green-300 border-green-400 border-opacity-30',
  meditation: 'bg-purple-400 bg-opacity-20 text-purple-300 border-purple-400 border-opacity-30',
  movement: 'bg-orange-400 bg-opacity-20 text-orange-300 border-orange-400 border-opacity-30',
  grounding: 'bg-yellow-400 bg-opacity-20 text-yellow-300 border-yellow-400 border-opacity-30',
};

const categoryIcons = {
  breathing: '🌬️',
  meditation: '🧘',
  movement: '💪',
  grounding: '🌱',
};

const categories = ['all', 'breathing', 'meditation', 'movement', 'grounding'];

export default function Activities() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = activities.filter(a => filter === 'all' || a.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Activities</h2>
          <p className="text-blue-300 text-sm mt-1">Browse and start any mindfulness activity.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                filter === cat
                  ? 'bg-blue-500 text-white'
                  : 'glass-card text-blue-300 glass-card-hover border border-white border-opacity-10'
              }`}
            >
              {cat === 'all' ? 'All Activities' : `${categoryIcons[cat]} ${cat}`}
            </button>
          ))}
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`glass-card border rounded-2xl p-6 flex flex-col gap-3 glass-card-hover transition ${categoryColors[a.category]}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{categoryIcons[a.category]}</span>
                <span className={`text-xs px-3 py-1 rounded-full border capitalize ${categoryColors[a.category]}`}>
                  {a.category}
                </span>
              </div>
              <h3 className="font-semibold text-white text-lg">{a.title}</h3>
              <p className="text-blue-200 text-sm flex-1">{a.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-blue-300">⏱ {a.duration} min</span>
                <button
                  onClick={() => navigate('/session')}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-400 transition"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}
