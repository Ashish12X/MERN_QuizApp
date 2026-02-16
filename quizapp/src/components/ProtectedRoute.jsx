import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, admin, adminOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && !admin) return <Navigate to="/" replace />;

  return children;
}
