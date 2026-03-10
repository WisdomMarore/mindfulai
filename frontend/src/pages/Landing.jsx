import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col">

      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-white border-opacity-10">
        <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-8" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-300 text-sm hover:text-white transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-blue-400 transition font-medium"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section — Value Proposition + Single CTA */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          Your emotions guide your
          <span className="text-blue-400"> mindfulness journey</span>
        </h1>

        {/* Meditation Image */}
        <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white border-opacity-10 shadow-2xl mb-8">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80"
            alt="Person meditating peacefully"
            className="w-full object-cover"
            style={{ maxHeight: '380px' }}
          />
        </div>

        <p className="text-blue-200 text-lg max-w-xl mb-10 leading-relaxed">
          MindfulAI uses computer vision to detect your emotional state in real time and recommends the perfect mindfulness activity — personalised just for you.
        </p>

        {/* Single CTA — as per video */}
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-400 transition text-lg shadow-lg shadow-blue-500 shadow-opacity-30"
        >
          Start Your Free Session →
        </button>
        <p className="text-blue-300 text-xs mt-4">No credit card required · Privacy first · No images stored</p>

        
      </section>
      

      {/* How It Works — Benefits Section */}
      <section className="bg-white bg-opacity-5 border-t border-white border-opacity-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">How It Works</h2>
          <p className="text-blue-300 text-center text-sm mb-12">Three simple steps to better mental wellbeing</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-white font-semibold mb-2">1. Look at Your Camera</h3>
              <p className="text-blue-300 text-sm leading-relaxed">Our AI analyses your facial expression in real time — no photos are ever stored or sent to a server.</p>
            </div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-white font-semibold mb-2">2. AI Detects Your Emotion</h3>
              <p className="text-blue-300 text-sm leading-relaxed">Deep learning models identify your emotional state — happy, sad, angry, fearful and more — with high accuracy.</p>
            </div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-white font-semibold mb-2">3. Get Your Activity</h3>
              <p className="text-blue-300 text-sm leading-relaxed">Our ML engine recommends the perfect mindfulness activity based on your emotion and personal history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Everything You Need</h2>
          <p className="text-blue-300 text-center text-sm mb-12">Built for your mental wellbeing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '😊', title: 'Real-Time Emotion Detection', desc: 'Powered by face-api.js deep learning — detects 7 emotions instantly from your camera.' },
              { icon: '📊', title: 'Personalised ML Recommendations', desc: 'Scikit-learn engine learns your patterns and recommends activities that work best for you.' },
              { icon: '🚨', title: '4-Tier Escalation System', desc: 'Monitors your emotional patterns and alerts you when professional support may be needed.' },
              { icon: '💬', title: 'Community Peer Support', desc: 'Share your journey and support others in a safe, moderated community space.' },
              { icon: '📈', title: 'Progress Dashboard', desc: 'Track your emotion trends, session history and wellbeing score over time.' },
              { icon: '🔒', title: 'Privacy First Architecture', desc: 'Emotion detection runs entirely on your device. No images ever leave your browser.' },
            ].map((f) => (
              <div key={f.title} className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 flex gap-4 items-start">
                <span className="text-3xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-blue-300 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Social Proof — Science Backed */}
      <section className="bg-white bg-opacity-5 border-t border-white border-opacity-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Backed by Science</h2>
          <p className="text-blue-300 text-center text-sm mb-12">What research says about mindfulness</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
              <p className="text-4xl font-bold text-blue-400 mb-3">43%</p>
              <p className="text-white text-sm font-semibold mb-2">Reduction in Anxiety</p>
              <p className="text-blue-300 text-xs leading-relaxed">A study published in JAMA Internal Medicine found that mindfulness meditation programmes significantly reduced anxiety, depression and pain.</p>
              <p className="text-blue-400 text-xs mt-3">— JAMA Internal Medicine, 2014</p>
            </div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
              <p className="text-4xl font-bold text-green-400 mb-3">8 Weeks</p>
              <p className="text-white text-sm font-semibold mb-2">To Rewire the Brain</p>
              <p className="text-blue-300 text-xs leading-relaxed">Harvard neuroscientists found that just 8 weeks of mindfulness practice increases grey matter density in brain regions linked to emotional regulation.</p>
              <p className="text-blue-400 text-xs mt-3">— Harvard Medical School, 2011</p>
            </div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6">
              <p className="text-4xl font-bold text-purple-400 mb-3">58%</p>
              <p className="text-white text-sm font-semibold mb-2">Less Emotional Reactivity</p>
              <p className="text-blue-300 text-xs leading-relaxed">Research from UC Berkeley shows that regular mindfulness practice significantly reduces emotional reactivity and improves overall psychological wellbeing.</p>
              <p className="text-blue-400 text-xs mt-3">— UC Berkeley, Greater Good Science Center</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your mindfulness journey?</h2>
          <p className="text-blue-300 mb-8">Join MindfulAI today and let AI guide your path to better mental wellbeing.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-400 transition text-lg shadow-lg"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 border-t border-blue-800 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-6" />
          <p className="text-blue-300 text-xs text-center">
            © {new Date().getFullYear()} MindfulAI — University of Zimbabwe · Bachelor Honours in Computer Science
          </p>
          <p className="text-blue-300 text-xs">Wisdom Marore · R207521B</p>
        </div>
      </footer>

    </div>
  );
}