import api from "./axios";

export async function getDashboard() {
    const response = await api.get("/users/dashboard");
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/users/me");
    return response.data;
}