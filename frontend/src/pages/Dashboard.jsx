import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MindfulCard from '../components/MindfulCard';
import { interventionAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';

const activities = [
  { id: 1, title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Calms anxiety fast.', duration: 5, category: 'breathing' },
  { id: 2, title: 'Body Scan', description: 'Slowly bring awareness to each part of your body from head to toe.', duration: 10, category: 'meditation' },
  { id: 3, title: 'Gratitude Reflection', description: 'Think of 3 things you are grateful for right now.', duration: 5, category: 'meditation' },
  { id: 4, title: 'Progressive Muscle Relaxation', description: 'Tense and release each muscle group to release physical stress.', duration: 15, category: 'movement' },
  { id: 5, title: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.', duration: 5, category: 'grounding' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Welcome back 👋</h2>
          <p className="text-gray-500 mt-1">How are you feeling today? Start a session to find out.</p>
        </div>
        <div className="bg-blue-900 text-white rounded-2xl p-6 mb-10 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Ready for your session?</h3>
            <p className="text-blue-200 text-sm mt-1">We'll detect your emotion and suggest the best activity for you.</p>
          </div>
          <button
            onClick={() => navigate('/session')}
            className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100 transition"
          >
            Start Session
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">All Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((a) => (
            <MindfulCard key={a.id} {...a} onStart={() => navigate('/session')} />
          ))}
        </div>
      </div>
    </div>
  );
}