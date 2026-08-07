import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import RatingStars from "../../components/ui/RatingStars";
import { Search, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ["userStores", page, search],
    queryFn: async () => {
      const response = await api.get(`/user/stores?page=${page}&limit=12&search=${search}`);
      return response.data.data;
    },
  });

  const rateMutation = useMutation({
    mutationFn: async ({ storeId, rating, isUpdate }) => {
      if (isUpdate) {
        return await api.put(`/user/ratings/${storeId}`, { rating });
      } else {
        return await api.post(`/user/ratings`, { storeId, rating });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userStores"]);
      toast.success("Rating submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  });

  const handleRate = (storeId, rating, currentRating) => {
    rateMutation.mutate({ storeId, rating, isUpdate: currentRating !== null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Available Stores</h1>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search stores..." 
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.items?.map((store) => (
            <Card key={store.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col h-full gap-4 p-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{store.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{store.address}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Average Rating</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-slate-800">
                        {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                      </span>
                      <Star className={`h-6 w-6 ${store.averageRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                    </div>
                  </div>
                  
                  <div className="w-full mt-4 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 text-center">
                      {store.myRating ? "Your Rating" : "Rate this store"}
                    </p>
                    <div className="flex justify-center">
                      <RatingStars 
                        rating={store.myRating || 0} 
                        onRate={(val) => handleRate(store.id, val, store.myRating)} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {data?.items?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Store className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium">No stores found</p>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          <span className="text-sm text-slate-500">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
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
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
