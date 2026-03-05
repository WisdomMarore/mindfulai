import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide">
        🧘 MindfulAI
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
        <Link to="/session" className="hover:text-blue-300 transition">New Session</Link>
        <Link to="/history" className="hover:text-blue-300 transition">History</Link>
        <button onClick={handleLogout} className="hover:text-red-300 transition">Logout</button>
      </div>
    </nav>
  );
}