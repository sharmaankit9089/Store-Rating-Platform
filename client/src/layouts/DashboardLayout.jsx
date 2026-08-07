import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Store, Users, LayoutDashboard, Star, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getSidebarLinks = () => {
    if (user?.role === "ADMIN") {
      return [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Stores", path: "/admin/stores", icon: Store },
      ];
    }
    if (user?.role === "OWNER") {
      return [
        { name: "Dashboard", path: "/owner", icon: LayoutDashboard },
        { name: "Ratings", path: "/owner/ratings", icon: Star },
      ];
    }
    return [
      { name: "Dashboard", path: "/user", icon: LayoutDashboard },
      { name: "Stores", path: "/user/stores", icon: Store },
    ];
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b p-4">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-primary-dark" />
          <span className="font-bold text-lg">StoreRating</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-64 bg-white border-r flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 absolute z-50 h-full" : "-translate-x-full md:relative md:h-screen"
        }`}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b hidden md:flex">
          <Store className="w-7 h-7 text-primary-dark" />
          <span className="font-bold text-xl text-gray-900">StoreRating</span>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary-dark"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-dark" : "text-gray-500"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary-dark flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</span>
              <span className="text-xs text-gray-500 mt-1">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8">
        <Outlet />
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
