
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication pages */}
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Signup />}
      />

      {/* User dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
