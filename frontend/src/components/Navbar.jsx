import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-900 border-b-4 border-zinc-100 p-4 font-mono">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-black uppercase text-orange-600 tracking-tight">
          //FINANCES APP
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/dashboard"
            className="text-sm uppercase font-bold text-zinc-300 hover:text-zinc-100"
          >
            Dashboard
          </Link>
          <Link
            to="/items"
            className="text-sm uppercase font-bold text-zinc-300 hover:text-zinc-100"
          >
            Itens
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-600 text-zinc-100 font-bold uppercase text-xs px-3 py-1 border-2 border-zinc-100 hover:bg-rose-500 shadow-[2px_2px_0px_0px_rgba(244,244,245,1)]"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}