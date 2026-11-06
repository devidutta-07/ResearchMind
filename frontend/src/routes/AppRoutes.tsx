import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"}
            replace
          />
        }
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;