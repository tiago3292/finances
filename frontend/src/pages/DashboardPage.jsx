import { useState, useEffect } from "react";
import { getDashboard } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

  if (isLoading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const saldo = dashboard["Saldo atual"];
  const resumoGastos = dashboard["Resumo de gastos"];
  const resumoGanhos = dashboard["Resumo de ganhos"];
  const maiorGasto = dashboard["Gasto com o maior valor"];
  const maiorGanho = dashboard["Ganho com o maior valor"];

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/items")}>Itens</button>
      <button onClick={logout}>Logout</button>

      <h2 style={{ color: saldo < 0 ? "red" : "green" }}>
        Saldo atual: R$ {saldo}
      </h2>

      <p>Total de gastos: R$ {dashboard["Total de gastos"]}</p>
      <p>Total de ganhos: R$ {dashboard["Total de ganhos"]}</p>

      <h3>Resumo de gastos por categoria</h3>
      <ul>
        {Object.entries(resumoGastos).map(([categoria, percentual]) => (
          <li key={categoria}>{categoria}: {percentual}</li>
        ))}
      </ul>

      <h3>Resumo de ganhos por categoria</h3>
      <ul>
        {Object.entries(resumoGanhos).map(([categoria, percentual]) => (
          <li key={categoria}>{categoria}: {percentual}</li>
        ))}
      </ul>

      <h3>Maior gasto</h3>
      {Object.entries(maiorGasto).map(([titulo, valor]) => (
        <p key={titulo}>{titulo}: R$ {valor}</p>
      ))}

      <h3>Maior ganho</h3>
      {Object.entries(maiorGanho).map(([titulo, valor]) => (
        <p key={titulo}>{titulo}: R$ {valor}</p>
      ))}
    </div>
  );
}

export default DashboardPage;