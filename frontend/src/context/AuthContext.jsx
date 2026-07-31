import { createContext, useState, useEffect } from "react";
import { loginUser } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("access_token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    async function login({ username, password }) {
        const data = await loginUser({ username, password });
        localStorage.setItem("access_token", data.access_token);
        setToken(data.access_token)
    }

    function logout() {
        localStorage.removeItem("access_token");
        setToken(null);
    }

    const value = {
        token,
        isAuthenticated: !! token,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}