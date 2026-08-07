import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access an unauthorized route
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "OWNER") return <Navigate to="/owner" replace />;
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
