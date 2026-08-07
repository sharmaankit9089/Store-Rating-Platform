import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600 mt-2">
          This is the admin area where you can manage users, stores, and view system statistics.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
