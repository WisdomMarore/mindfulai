import { Link } from 'react-router-dom';

export default function Footer() {
  return (
 <footer className="mt-auto bg-blue-900 border-t border-blue-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-7 mb-3" />
            <p className="text-gray-400 text-xs leading-relaxed">
              A Computer Vision AI system for personalised mindfulness interventions based on emotional state recognition.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs">✓</span>
                <span className="text-gray-400 text-xs">Privacy First Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs">✓</span>
                <span className="text-gray-400 text-xs">No images stored — ever</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs">✓</span>
                <span className="text-gray-400 text-xs">AI powered emotion detection</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="text-gray-400 text-xs hover:text-white transition">Dashboard</Link>
              <Link to="/session" className="text-gray-400 text-xs hover:text-white transition">New Session</Link>
              <Link to="/history" className="text-gray-400 text-xs hover:text-white transition">Session History</Link>
              <Link to="/activities" className="text-gray-400 text-xs hover:text-white transition">Activities</Link>
              <Link to="/community" className="text-gray-400 text-xs hover:text-white transition">Community</Link>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wider">How It Works</h4>
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 text-xs">1. Allow camera access</p>
              <p className="text-gray-400 text-xs">2. AI detects your emotion</p>
              <p className="text-gray-400 text-xs">3. Get a personalised activity</p>
              <p className="text-gray-400 text-xs">4. Track your progress</p>
              <p className="text-gray-400 text-xs">5. Get support when needed</p>
            </div>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wider">Technology</h4>
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 text-xs">React 19 + Vite</p>
              <p className="text-gray-400 text-xs">face-api.js (Deep Learning)</p>
              <p className="text-gray-400 text-xs">Scikit-learn (ML)</p>
              <p className="text-gray-400 text-xs">Django REST Framework</p>
              <p className="text-gray-400 text-xs">PostgreSQL Database</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} MindfulAI — All rights reserved
          </p>
        
          <p className="text-gray-500 text-xs">
            Wisdom Marore 
          </p>
        </div>

      </div>
    </footer>
  );
}