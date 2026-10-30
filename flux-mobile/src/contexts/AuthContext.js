import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser } from "../api/auth";
import { saveToken, getToken, removeToken } from "../storage/token";
import { setUnauthorizedHandler } from "../api/axios";
import { clearItemsCache } from "../storage/cache";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            const token = await getToken();
            setIsSignedIn(!!token);
            setIsLoading(false);
        }
        restoreSession();
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            clearItemsCache();
            setIsSignedIn(false);
        });
    }, []);

    async function signIn(username, password) {
        const data = await loginUser({ username, password });
        await saveToken(data.access_token);
        setIsSignedIn(true);
    }

    const signOut = useCallback(async () => {
        await removeToken();
        await clearItemsCache();
        setIsSignedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isSignedIn, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}