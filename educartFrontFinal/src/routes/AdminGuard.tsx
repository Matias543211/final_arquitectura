import { Navigate, Outlet } from "react-router";
import { useAuth } from "../features/Auth/hooks/useAuth";

export const AdminGuard = () => {
    const { user } = useAuth();

    if (!user || user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};