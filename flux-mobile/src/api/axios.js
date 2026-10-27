import axios from "axios";
import { getToken, removeToken } from "../storage/token";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
    onUnauthorized = fn;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isLoginRequest = error.config?.url === "/auth/token";
        if (error.response?.status === 401 && !isLoginRequest) {
            await removeToken();
            if (onUnauthorized) onUnauthorized();
        }
        return Promise.reject(error);
    }
);

export default api;