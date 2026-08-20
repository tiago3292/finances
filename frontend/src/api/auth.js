import api from "./axios";

// async porque toda chamada HTTP é assíncrona.
// await pausa a execução da função até a resposta chegar
export async function registerUser({ username, email, password }) {
    const response = await api.post("/auth/register", {
        username,
        email,
        password,
    }); // Axios já manda o segundo argumento json (header Content-Type: application/json) automático
    return response.data; // .data é o corpo da resposta (nesse caso, o json do UserResponse)
    // separado do objeto total embrulado pelo Axios.
}

export async function loginUser({ username, password }) {
    // Cria um objeto que monta dados no formato application/x-www-form-urlencoded
    // que vem do HTML form (ex: username=test&password=123 ao invés de
    // {"username" = "test", "password", "123"} para se comunicar com o
    // OAuth2PasswordRequestForm.
    const params = new URLSearchParams();
    // Adiciona cada campo manualmente. Ao contrário do JS comum, URLSearchParams
    // tem seu prórpio jeito de construir dados.
    params.append("username", username);
    params.append("password", password);

    const response = await api.post("/auth/token", params, {

        // Transforma o Content-Type padrão para o formato do furmulário.
        // Sem isso, o FastAPI receberia os dados no formato errado e
        // retornaria 422
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data
}