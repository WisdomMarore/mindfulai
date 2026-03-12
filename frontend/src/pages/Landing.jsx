import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080d18', fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav className="px-8 py-5 flex justify-between items-center border-b border-white border-opacity-10 sticky top-0 z-50"
        style={{ background: 'rgba(8,13,24,0.97)', backdropFilter: 'blur(12px)' }}>
        <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-8" />
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="text-gray-400 text-sm hover:text-white transition" style={{ opacity: 0.7 }}>
            Log In
          </button>
          <button onClick={() => navigate('/login')}
            className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-full hover:bg-blue-500 transition font-medium">
            Try MindfulAI Free
          </button>
        </div>
      </nav>

      {/* Hero — Star of the show: full background image */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage: 'url(/feather-hand.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      >
        {/* Depth overlay — gradient not flat black */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(8,13,24,0.5) 0%, rgba(8,13,24,0.75) 60%, rgba(8,13,24,1) 100%)'
        }} />

        <div className="relative z-10 flex flex-col items-center max-w-3xl py-32">
          {/* Visual rhyme — pill badge */}
          <span className="border border-blue-400 border-opacity-30 text-blue-300 text-xs px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
            style={{ opacity: 0.8, background: 'rgba(59,130,246,0.08)' }}>
            AI Powered · Privacy First · Free to Start
          </span>

          {/* Anchor font — Playfair Display for headline */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6">
            Unlock inner calm.<br />
            <span className="text-blue-400">Live life fully.</span>
          </h1>

          {/* Subheading — Inter, reduced opacity for hierarchy */}
          <p className="text-gray-300 text-xl max-w-xl mb-10 leading-relaxed"
            style={{ opacity: 0.75, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            MindfulAI detects your emotion in real time and recommends a personalised mindfulness activity — so you can feel better in minutes, not months.
          </p>

          {/* Single CTA */}
          <button onClick={() => navigate('/login')}
            className="bg-blue-600 text-white font-semibold px-12 py-4 rounded-full hover:bg-blue-500 transition text-base shadow-2xl">
            Start Your Free Session Today
          </button>
          <p className="text-gray-500 text-xs mt-4" style={{ opacity: 0.5 }}>
            No credit card · No images stored · Cancel anytime
          </p>
        </div>
      </section>

      {/* Science stats bar — visual rhyme with glass cards */}
      <section className="py-10 px-6" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { stat: '43%', label: 'Reduction in anxiety', source: 'JAMA, 2014' },
            { stat: '8 Weeks', label: 'To rewire the brain', source: 'Harvard Medical School, 2011' },
            { stat: '58%', label: 'Less emotional reactivity', source: 'UC Berkeley' },
          ].map((s) => (
            <div key={s.stat} className="text-center py-4 px-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-3xl font-bold text-blue-400 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{s.stat}</p>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-gray-500 text-xs mt-1" style={{ opacity: 0.6 }}>{s.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #0d1b2a 0%, #1a2744 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold text-center uppercase tracking-widest mb-3" style={{ opacity: 0.8 }}>Why MindfulAI</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white text-center mb-4">
            We're here to help you feel better.
          </h2>
          <p className="text-center text-sm mb-16 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            You don't need years of therapy or expensive retreats. MindfulAI meets you where you are — right now, in this moment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
                title: 'Feel calmer in minutes — not months.',
                desc: 'The moment MindfulAI detects stress or anxiety, it immediately recommends a proven activity to bring you back to calm. No waiting rooms, no appointments.',
              },
              {
                icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
                title: 'Watch your wellbeing improve over time.',
                desc: 'Your personal dashboard tracks your emotional patterns and wellbeing score — so you can actually see yourself getting better, week by week.',
              },
              {
                icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
                title: 'Never feel alone in your journey.',
                desc: "Join a supportive community of people on the same path. Share your experience, get encouragement, and know that you're not going through this alone.",
              },
              {
                icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
                title: 'Your privacy is fully protected.',
                desc: 'Emotion detection runs entirely on your device. No images are ever stored or sent anywhere. What happens in your session stays with you.',
              },
            ].map((b) => (
              <div key={b.title} className="flex gap-5 p-6 rounded-2xl transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
                onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(59,130,246,0.3)'}
                onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'}
              >
                <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.15)' }}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Break — visual rhyme, both images rounded same way */}
      <section className="py-16 px-6" style={{ background: '#080d18' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl overflow-hidden" style={{ height: '320px' }}>
            <img src="/meditation-stones.jpg" alt="Balance and calm" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-3xl overflow-hidden" style={{ height: '320px' }}>
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=90" alt="Peaceful meditation" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Backed by Science */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #111827 0%, #1e3a5f 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold text-center uppercase tracking-widest mb-3" style={{ opacity: 0.8 }}>Research Backed</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white text-center mb-4">
            Science says mindfulness works.
          </h2>
          <p className="text-center text-sm mb-16 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            Decades of peer-reviewed research confirm what millions already know — mindfulness genuinely transforms mental wellbeing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: '43%', color: 'text-blue-400', border: 'rgba(59,130,246,0.2)', title: 'Reduction in Anxiety', desc: 'Mindfulness-based programmes significantly reduced anxiety, depression and chronic pain in patients across multiple clinical trials.', source: 'JAMA Internal Medicine, 2014', icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg> },
              { stat: '8 Weeks', color: 'text-green-400', border: 'rgba(74,222,128,0.2)', title: 'To Rewire Your Brain', desc: 'Harvard neuroscientists found just 8 weeks of mindfulness increases grey matter in brain regions controlling emotion and memory.', source: 'Harvard Medical School, 2011', icon: <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
              { stat: '58%', color: 'text-purple-400', border: 'rgba(167,139,250,0.2)', title: 'Less Emotional Reactivity', desc: 'UC Berkeley researchers found regular mindfulness significantly reduces how strongly negative emotions affect daily decisions.', source: 'UC Berkeley, Greater Good Science Center', icon: <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl p-7"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.border}`, backdropFilter: 'blur(8px)' }}>
                <div className="flex justify-between items-start mb-5">
                  <p className={`text-5xl font-bold ${s.color}`} style={{ fontFamily: "'Playfair Display', serif" }}>{s.stat}</p>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>📄 {s.source}</p>
                </div>
              </div>
            ))}
          </div>

          {/* WHO Quote — glass card visual rhyme */}
          <div className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(8px)' }}>
            <p className="text-blue-300 text-xs uppercase tracking-widest mb-4 font-semibold" style={{ opacity: 0.8 }}>World Health Organisation</p>
            <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, opacity: 0.9 }}>
              "Mental health is the foundation for wellbeing and effective functioning."
            </p>
            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              MindfulAI is built on this principle — proactive, personalised mental wellness for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #0d1b2a 0%, #1a2744 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold text-center uppercase tracking-widest mb-3" style={{ opacity: 0.8 }}>How It Works</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white text-center mb-4">
            Start feeling better in 3 steps.
          </h2>
          <p className="text-center text-sm mb-16 max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            No complicated setup. No learning curve. Just results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <svg className="w-10 h-10 text-blue-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>, title: 'Look at your camera', desc: 'Allow camera access for a few seconds. No photos are stored — ever.' },
              { step: '02', icon: <svg className="w-10 h-10 text-blue-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>, title: 'AI reads your emotion', desc: 'Our deep learning model instantly detects your emotional state with high accuracy.' },
              { step: '03', icon: <svg className="w-10 h-10 text-blue-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, title: 'Get your activity instantly', desc: 'Receive a personalised mindfulness activity matched to exactly how you feel right now.' },
            ].map((h) => (
              <div key={h.title} className="rounded-2xl p-8 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
                <p className="text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(59,130,246,0.15)' }}>{h.step}</p>
                {h.icon}
                <h3 className="text-white font-semibold mt-4 mb-2">{h.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' }}>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-4" style={{ opacity: 0.8 }}>Get Started Today</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white mb-5 leading-tight">
            Your journey to inner calm starts with one click.
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Join thousands of people already using MindfulAI to manage stress, understand their emotions and live more fully.
          </p>
          <button onClick={() => navigate('/login')}
            className="bg-white text-blue-700 font-bold px-12 py-5 rounded-full hover:bg-blue-50 transition text-base shadow-2xl">
            Start Your Free Session Today →
          </button>
          <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No credit card required · Privacy first · Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ background: '#04060e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-6" />
          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} MindfulAI — University of Zimbabwe · Bachelor Honours in Computer Science
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Wisdom Marore · R207521B</p>
        </div>
      </footer>

    </div>
  );
}