import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminStores from "../pages/admin/Stores";
import UserDashboard from "../pages/user/Dashboard";
import OwnerDashboard from "../pages/owner/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Signup />}
        />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/stores" element={<AdminStores />} />
        </Route>
      </Route>

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/user" element={<UserDashboard />} />
        </Route>
      </Route>

      {/* Protected Owner Routes */}
      <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={`/${user.role.toLowerCase()}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
