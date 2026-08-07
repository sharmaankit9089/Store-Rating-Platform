import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import RatingStars from "../../components/ui/RatingStars";
import { Star, MessageSquare } from "lucide-react";

const OwnerDashboard = () => {
  const [page, setPage] = useState(1);
  
  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["ownerDashboard"],
    queryFn: async () => {
      const response = await api.get(`/owner/dashboard`);
      return response.data.data;
    },
  });

  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ["ownerRatings", page],
    queryFn: async () => {
      const response = await api.get(`/owner/ratings?page=${page}&limit=10`);
      return response.data.data;
    },
  });

  if (isLoadingDashboard) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Owner Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage {dashboard?.store?.name}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-slate-900">
                  {dashboard?.averageRating ? dashboard.averageRating.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Ratings</p>
              <p className="text-2xl font-bold text-slate-900">{dashboard?.totalRatings || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Ratings</h3>
        </div>

        {isLoadingRatings ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">User Name</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ratings?.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.user?.name || "Unknown User"}
                      <div className="text-xs text-slate-500 font-normal">{item.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <RatingStars rating={item.rating} readonly />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
                {ratings?.items?.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      No ratings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {ratings?.pagination && ratings.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <span className="text-sm text-slate-500">
              Page {ratings.pagination.currentPage} of {ratings.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                disabled={page === ratings.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OwnerDashboard;
