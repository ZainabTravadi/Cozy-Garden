import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <main className="route-loading">Loading your garden...</main>;
  if (!user) return <Navigate replace state={{ from: location }} to="/login" />;
  return <Outlet />;
}

export default ProtectedRoute;
