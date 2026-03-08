import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MindfulCard from '../components/MindfulCard';

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
  breathing: 'bg-green-100 text-green-700',
  meditation: 'bg-purple-100 text-purple-700',
  movement: 'bg-orange-100 text-orange-700',
  grounding: 'bg-yellow-100 text-yellow-700',
};

const categories = ['all', 'breathing', 'meditation', 'movement', 'grounding'];

export default function Activities() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Activities</h2>
          <p className="text-gray-400 text-sm mt-1">Browse and start any mindfulness activity.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                filter === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities
            .filter((a) => filter === 'all' || a.category === filter)
            .map((a) => (
              <MindfulCard key={a.id} {...a} onStart={() => navigate('/session')} />
            ))}
        </div>

      </div>
    </div>
  );
}