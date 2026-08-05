import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 422) {
        setError("Verifique os dados informados.");
      } else {
        setError("Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border-4 border-zinc-100 p-8 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)]">
        <header className="mb-6 border-b-4 border-zinc-100 pb-3">
          <h1 className="text-3xl font-black uppercase tracking-tight">Cadastro</h1>
          <p className="text-xs text-zinc-400 uppercase mt-1 font-bold">Crie sua nova conta de acesso</p>
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
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800 transition-colors"
              placeholder="Crie um nome de usuário"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase mb-1 text-zinc-300 tracking-wide">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800 transition-colors"
              placeholder="seu@email.com"
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
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border-2 border-rose-500 bg-rose-950/50 p-3 text-rose-400 text-xs font-bold uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-100 text-zinc-950 font-black uppercase p-3 border-2 border-zinc-100 hover:bg-zinc-300 active:translate-x-1 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {isSubmitting ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <footer className="mt-6 pt-4 border-t-2 border-zinc-800 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase">
            Já tem conta?{" "}
            <Link to="/login" className="text-zinc-100 underline hover:text-zinc-300 font-black">
              Entrar
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default RegisterPage;