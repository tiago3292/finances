import axios from "axios";

// axios.create baseURL cria uma instância do axios, fazendo chamadas
// CRUD já saírem com a URL base configurada na rota

// import.meta.env.VITE_API_URL é a forma que o Vite lê variáveis de
// ambiente. Equivalente a os.getenv do python. "VITE_" é obrigatório
// antes do nome da variável
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default api;