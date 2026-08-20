import axios from "axios";

// Detect if running in Docker or locally
// If window.location.hostname is 'localhost' or '127.0.0.1', use localhost:8000
// Otherwise use the internal Docker hostname
const apiUrl = 
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : import.meta.env.VITE_API_URL || "http://finance-api-container:8000";

console.log("API URL:", apiUrl);
console.log("Window hostname:", window.location.hostname);

const api = axios.create({
  baseURL: apiUrl,
});

// interceptor é uma função que roda antes da requisição. Ele intercepta
// os detalhes da requisição (nessa caso, config) e injeta o header de
// autenticação, se houver.
// localStorage.getItem() lê o token do localStorage do navegador.
// config.headers.Authorization monta o header que o get_current_user()
// do backend espera. OAuth2PasswordBearer lê o header automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // O interceptor precisa devolver o config obrigatóriamente
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
