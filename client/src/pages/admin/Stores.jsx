import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../api/axios";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// --- Validations ---
const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Store address is required"),
  ownerId: z.string().min(1, "Owner is required").transform(Number),
});

const SortHeader = ({ label, field, currentSortBy, currentSortOrder, onSort }) => {
  return (
    <th 
      className="px-6 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {currentSortBy === field ? (
          currentSortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-slate-300" />
        )}
      </div>
    </th>
  );
};

const AdminStores = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: ["adminStores", page, search, sortBy, sortOrder],
    queryFn: async () => {
      const response = await api.get(`/admin/stores?page=${page}&limit=10&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      return response.data.data;
    },
  });

  const { data: ownersData, isLoading: isLoadingOwners } = useQuery({
    queryKey: ["adminUsers", "OWNER"],
    queryFn: async () => {
      // Fetch users specifically with role OWNER to populate the dropdown
      const response = await api.get(`/admin/users?role=OWNER&limit=100`);
      return response.data.data.items;
    },
    enabled: isCreateModalOpen, // Only fetch when modal opens
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post("/admin/stores", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminStores"]);
      toast.success("Store created successfully!");
      setIsCreateModalOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create store");
    }
  });

  // --- Form ---
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createStoreSchema),
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Store Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add New Store</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by name or address..." 
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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
                  <SortHeader label="Store Name" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortHeader label="Email" field="email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <th className="px-6 py-3 font-medium">Owner</th>
                  <SortHeader label="Address" field="address" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortHeader label="Avg Rating" field="averageRating" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
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

      {/* Create Store Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); reset(); }} title="Add New Store">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Store Name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Address" {...register("address")} error={errors.address?.message} />
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Assign Owner</label>
            <select
              className={`rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.ownerId ? 'border-red-500' : 'border-slate-300'}`}
              {...register("ownerId")}
            >
              <option value="">Select an owner...</option>
              {isLoadingOwners ? (
                <option value="" disabled>Loading owners...</option>
              ) : (
                ownersData?.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                ))
              )}
            </select>
            {errors.ownerId && <span className="text-xs text-red-500">{errors.ownerId.message}</span>}
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={createMutation.isPending}>
            Create Store
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStores;
