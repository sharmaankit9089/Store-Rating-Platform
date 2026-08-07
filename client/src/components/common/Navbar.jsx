import { useAuth } from "../../hooks/useAuth";
import { LogOut, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
          S
        </div>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Store Rating Platform</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <UserCircle className="h-5 w-5" />
          <span className="hidden sm:inline-block font-medium">{user?.name}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 uppercase">
            {user?.role}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline-block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
