
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
