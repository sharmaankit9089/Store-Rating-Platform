import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Users, Store, Star } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });

  if (isLoading) return <Loader fullScreen />;

  const stats = [
    { label: "Total Users", value: dashboardData.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Stores", value: dashboardData.totalStores, icon: Store, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Total Ratings", value: dashboardData.totalRatings, icon: Star, color: "text-yellow-600", bg: "bg-yellow-100" },
  ];

  // Dummy data for chart since backend doesn't provide distribution yet
  const chartData = [
    { name: "5 Stars", count: 40 },
    { name: "4 Stars", count: 30 },
    { name: "3 Stars", count: 15 },
    { name: "2 Stars", count: 10 },
    { name: "1 Star", count: 5 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Ratings Distribution (Demo)</h3>
        </div>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
