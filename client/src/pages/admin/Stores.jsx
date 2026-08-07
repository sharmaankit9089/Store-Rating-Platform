import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import { Search } from "lucide-react";

const AdminStores = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: ["adminStores", page, search],
    queryFn: async () => {
      const response = await api.get(`/admin/stores?page=${page}&limit=10&search=${search}`);
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Store Management</h1>
        <Button>Add New Store</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by name or address..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Store Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Owner</th>
                  <th className="px-6 py-3 font-medium">Address</th>
                  <th className="px-6 py-3 font-medium">Avg Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.items?.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{store.name}</td>
                    <td className="px-6 py-4">{store.email}</td>
                    <td className="px-6 py-4">{store.owner?.name || "-"}</td>
                    <td className="px-6 py-4">{store.address || "-"}</td>
                    <td className="px-6 py-4 font-semibold text-yellow-600">
                      {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                    </td>
                  </tr>
                ))}
                {data?.items?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No stores found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
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
      </Card>
    </div>
  );
};

export default AdminStores;
