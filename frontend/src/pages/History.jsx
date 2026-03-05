import Navbar from '../components/Navbar';

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Session History</h2>
        <p className="text-gray-500 text-sm mb-8">Your past mindfulness sessions will appear here.</p>
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>No sessions yet. Start your first session to see your history.</p>
        </div>
      </div>
    </div>
  );
}