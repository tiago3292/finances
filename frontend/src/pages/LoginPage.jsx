import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col items-center justify-center p-4">
      <h1 className="flex justify-center pb-10 text-6xl font-black uppercase text-orange-600">Finances App</h1>
      <div className="w-full max-w-md bg-zinc-900 border-1 border-zinc-600 p-8">
        <header className="mb-6 border-b-1 border-zinc-600 pb-3">
          <h2 className="text-3xl font-black uppercase tracking-tight">Login</h2>
          <p className="text-xs text-zinc-400 uppercase mt-1 font-bold">Acesse sua conta para continuar</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-xs font-black uppercase mb-1 text-zinc-300 tracking-wide">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-zinc-950 border-1 border-zinc-600 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800 transition-colors"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-black uppercase mb-1 text-zinc-300 tracking-wide">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-950 border-1 border-zinc-600 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border-1 border-rose-500 bg-rose-950/50 p-3 text-rose-400 text-xs font-bold uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-100 text-zinc-950 font-black uppercase p-3 hover:bg-zinc-300 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <footer className="mt-6 pt-4 border-t-1 border-zinc-600 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase">
            Não tem conta?{" "}
            <Link to="/register" className="text-orange-600 underline hover:text-zinc-300 font-black">
              Cadastre-se
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;