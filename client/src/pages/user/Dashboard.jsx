import { useAuth } from "../../hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Dashboard</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600 mt-2">
          From here you can view all available stores and submit your ratings.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
