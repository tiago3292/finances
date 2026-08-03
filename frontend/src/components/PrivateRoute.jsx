import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }

    return <Outlet />
}

export default PrivateRoute