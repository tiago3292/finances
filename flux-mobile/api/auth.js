import api from "./axios";

export async function loginUser({ username, password }) {
    const body =
    `username=${encodeURIComponent(username)}` +
    `&password=${encodeURIComponent(password)}`;

    const response = await api.post("/auth/token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
}