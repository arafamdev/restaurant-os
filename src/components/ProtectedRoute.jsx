import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // Wait until Supabase finishes checking the session.
  if (isLoading) {
    return null;
  }

  // No authenticated user → send them to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated user → render the protected route.
  return <Outlet />;
}

export default ProtectedRoute;
