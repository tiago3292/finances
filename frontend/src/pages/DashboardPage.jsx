import { useState, useEffect } from "react";
import { getDashboard } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Navbar from "../components/Navbar";

// Paleta baseada em zinc com acentos brutais
const COLORS_GASTOS = ["#ff637e", "#cc495f", "#aa3347", "#8d2335", "#6b1321"];
const COLORS_GANHOS = ["#22c55e", "#16a34a", "#15803d", "#166534"];

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        setError("Não foi possível carregar o dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-8 flex items-center justify-center">
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)] animate-pulse">
          <p className="text-xl font-black uppercase">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-8 flex items-center justify-center">
        <div className="border-4 border-rose-500 p-6 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] text-rose-400">
          <p className="text-xl font-black uppercase">{error}</p>
        </div>
      </div>
    );
  }

  const saldo = dashboard["Saldo atual"];
  const resumoGastos = dashboard["Resumo de gastos"];
  const resumoGanhos = dashboard["Resumo de ganhos"];
  const maiorGasto = dashboard["Gasto com o maior valor"];
  const maiorGanho = dashboard["Ganho com o maior valor"];

  // Converte os dicionários de percentual para o formato exigido pelo Recharts
  const pieDataGastos = Object.entries(resumoGastos).map(([categoria, percentual]) => ({
    name: categoria,
    value: parseFloat(percentual.replace("%", "")),
  }));

  const pieDataGanhos = Object.entries(resumoGanhos).map(([categoria, percentual]) => ({
    name: categoria,
    value: parseFloat(percentual.replace("%", "")),
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6 md:p-10 space-y-8">
      {/* Header com Navegação */}
      <Navbar />
      <header className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-orange-600 uppercase tracking-tight">Dashboard</h1>
          <p className="text-xs text-zinc-400 uppercase mt-1 font-bold">Resumo Geral Financeiro</p>
        </div>
      </header>

      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Saldo Atual */}
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)]">
          <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
            Saldo Atual
          </span>
          <h2
            className={`text-4xl font-black mt-3 ${
              saldo < 0 ? "text-rose-500" : "text-emerald-400"
            }`}
          >
            R$ {Number(saldo).toFixed(2)}
          </h2>
        </div>

        {/* Card Total de Ganhos */}
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)]">
          <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
            Total de Ganhos
          </span>
          <p className="text-3xl font-black mt-3 text-emerald-400">
            + R$ {Number(dashboard["Total de ganhos"]).toFixed(2)}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-zinc-800">
            <span className="text-xs text-zinc-400 font-bold uppercase block">Maior Ganho:</span>
            {Object.entries(maiorGanho).map(([titulo, valor]) => (
              <p key={titulo} className="text-sm font-bold text-zinc-200 mt-1">
                {titulo}: <span className="text-emerald-400">R$ {valor}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Card Total de Gastos */}
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)]">
          <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
            Total de Gastos
          </span>
          <p className="text-3xl font-black mt-3 text-rose-400">
            - R$ {Number(dashboard["Total de gastos"]).toFixed(2)}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-zinc-800">
            <span className="text-xs text-zinc-400 font-bold uppercase block">Maior Gasto:</span>
            {Object.entries(maiorGasto).map(([titulo, valor]) => (
              <p key={titulo} className="text-sm font-bold text-zinc-200 mt-1">
                {titulo}: <span className="text-rose-400">R$ {valor}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Resumos por Categoria + Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bloco Resumo de Ganhos */}
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)] space-y-6">
          <h3 className="text-xl font-black uppercase border-b-4 border-zinc-100 pb-2 text-emerald-400">
            Resumo de Ganhos por Categoria
          </h3>

          <ul className="space-y-2">
            {Object.entries(resumoGanhos).map(([categoria, percentual]) => (
              <li
                key={categoria}
                className="flex justify-between items-center border-2 border-zinc-100 p-3 bg-zinc-950 font-bold"
              >
                <span className="uppercase text-zinc-300">{categoria}</span>
                <span className="text-emerald-400 font-black">{percentual}</span>
              </li>
            ))}
          </ul>

          {/* Gráfico de Pizza (Ganhos) */}
          {pieDataGanhos.length > 0 && (
            <div className="h-64 pt-4 border-t-2 border-zinc-800">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataGanhos}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke="#09090b"
                    strokeWidth={3}
                  >
                    {pieDataGanhos.map((_, index) => (
                      <Cell
                        key={`cell-ganho-${index}`}
                        fill={COLORS_GANHOS[index % COLORS_GANHOS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#f4f4f5",
                      borderWidth: "2px",
                      color: "#f4f4f5",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bloco Resumo de Gastos */}
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)] space-y-6">
          <h3 className="text-xl font-black uppercase border-b-4 border-zinc-100 pb-2 text-rose-400">
            Resumo de Gastos por Categoria
          </h3>

          <ul className="space-y-2">
            {Object.entries(resumoGastos).map(([categoria, percentual]) => (
              <li
                key={categoria}
                className="flex justify-between items-center border-2 border-zinc-100 p-3 bg-zinc-950 font-bold"
              >
                <span className="uppercase text-zinc-300">{categoria}</span>
                <span className="text-rose-400 font-black">{percentual}</span>
              </li>
            ))}
          </ul>

          {/* Gráfico de Pizza (Gastos) */}
          {pieDataGastos.length > 0 && (
            <div className="h-64 pt-4 border-t-2 border-zinc-800">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataGastos}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke="#09090b"
                    strokeWidth={3}
                  >
                    {pieDataGastos.map((_, index) => (
                      <Cell
                        key={`cell-gasto-${index}`}
                        fill={COLORS_GASTOS[index % COLORS_GASTOS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#f4f4f5",
                      borderWidth: "2px",
                      color: "#f4f4f5",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;