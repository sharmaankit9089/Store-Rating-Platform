import { Outlet } from "react-router-dom";
import { Store } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-primary-dark" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">StoreRating</h1>
          <p className="text-sm text-gray-500 mt-1">Platform for trusted reviews</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
