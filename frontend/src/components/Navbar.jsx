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
    <nav className="border-b-1 -mx-13 md:-mx-10 -mt-5 md:-mt-8 border-zinc-600 p-4 font-mono">
      <div className="mx-8 md:mx-7 flex justify-between items-center">
        <Link to="/dashboard" className="text-sm md:text-2xl font-black uppercase text-orange-600 tracking-tight">
          //FINANCES APP
        </Link>
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link
            to="/dashboard"
            className="border-1 border-zinc-600 px-3 py-1 text-sm uppercase font-bold text-zinc-100 hover:bg-zinc-600"
          >
            Dashboard
          </Link>
          <Link
            to="/items"
            className="border-1 border-zinc-600 px-3 py-1 text-sm uppercase font-bold text-zinc-100 hover:bg-zinc-600"
          >
            Itens
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer bg-rose-600/50 px-3 py-1 text-sm uppercase font-bold text-zinc-100 hover:bg-rose-500/80"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}