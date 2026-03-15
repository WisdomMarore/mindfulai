import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/session', label: 'Session' },
    { to: '/history', label: 'History' },
    { to: '/activities', label: 'Activities' },
    { to: '/community', label: 'Community' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/admin-dashboard', label: 'Admin' },
  ];

  return (
    <nav className="bg-blue-900 border-b border-blue-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/dashboard">
          <img src="/mindfulai-logo.svg" alt="MindfulAI" className="h-8" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-blue-200 text-sm hover:text-white transition">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-blue-300 text-sm">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-white text-sm px-4 py-2 rounded-xl transition border border-white border-opacity-40 hover:bg-white hover:bg-opacity-10"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-800 pt-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="text-blue-200 text-sm px-3 py-2.5 rounded-xl hover:bg-white hover:bg-opacity-10 transition"
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-blue-800 mt-3 pt-3 flex justify-between items-center px-3">
            <span className="text-blue-300 text-sm">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-10 text-white text-sm px-4 py-2 rounded-xl glass-card-hover transition"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}