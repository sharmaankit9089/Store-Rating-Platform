import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard, Users, Store as StoreIcon, Star } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/stores", icon: StoreIcon, label: "Stores" },
  ];

  const ownerLinks = [
    { to: "/owner", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/owner/ratings", icon: Star, label: "Store Ratings" },
  ];

  const userLinks = [
    { to: "/user", icon: LayoutDashboard, label: "Dashboard", end: true },
  ];

  let links = [];
  if (user?.role === "ADMIN") links = adminLinks;
  if (user?.role === "OWNER") links = ownerLinks;
  if (user?.role === "USER") links = userLinks;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white pt-16 md:flex">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
