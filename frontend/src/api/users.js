import api from "./axios";

export async function getDashboard() {
    const response = await api.get("/users/dashboard");
    return response.data;
}