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
import RatingStars from "../../components/ui/RatingStars";
import toast from "react-hot-toast";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// --- Validations ---
const createUserSchema = z.object({
  name: z.string().min(20, "Name must be at least 20 characters").max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/, "Password must be 8-16 chars, contain 1 uppercase and 1 special char"),
  address: z.string().max(400, "Address cannot exceed 400 characters").optional(),
  role: z.enum(["ADMIN", "USER", "OWNER"], { required_error: "Role is required" }),
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

const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const queryClient = useQueryClient();
  
  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page, search, role, sortBy, sortOrder],
    queryFn: async () => {
      let url = `/admin/users?page=${page}&limit=10&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (role) url += `&role=${role}`;
      const response = await api.get(url);
      return response.data.data;
    },
  });

  const { data: selectedUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["adminUser", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await api.get(`/admin/users/${selectedUserId}`);
      return response.data.data;
    },
    enabled: !!selectedUserId,
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post("/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.success("User created successfully!");
      setIsCreateModalOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  });

  // --- Form ---
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createUserSchema),
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
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add New User</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by name, email or address..." 
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-800">
                <tr>
                  <SortHeader label="Name" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortHeader label="Email" field="email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortHeader label="Role" field="role" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortHeader label="Address" field="address" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.items?.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 line-clamp-1 max-w-[200px]">{user.address || "-"}</td>
                  </tr>
                ))}
                {data?.items?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No users found.
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

      {/* View User Details Modal */}
      <Modal isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)} title="User Details">
        {isLoadingUser ? (
          <Loader />
        ) : selectedUser ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
              <p className="text-slate-900 font-medium">{selectedUser.name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
              <p className="text-slate-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
              <p className="text-indigo-600 font-semibold">{selectedUser.role}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
              <p className="text-slate-900">{selectedUser.address || "N/A"}</p>
            </div>
            {selectedUser.role === "OWNER" && selectedUser.store && (
              <div className="bg-slate-50 p-4 rounded-lg mt-4 border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-2">Store Details</h4>
                <p className="text-sm text-slate-600"><span className="font-medium">Name:</span> {selectedUser.store.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium text-slate-600">Store Rating:</span>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-900 mr-1">
                      {selectedUser.store.averageRating ? selectedUser.store.averageRating.toFixed(1) : "N/A"}
                    </span>
                    {selectedUser.store.averageRating > 0 && (
                      <RatingStars rating={Math.round(selectedUser.store.averageRating)} readonly />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">Failed to load user details.</p>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); reset(); }} title="Add New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
          <Input label="Address" {...register("address")} error={errors.address?.message} />
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              className={`rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.role ? 'border-red-500' : 'border-slate-300'}`}
              {...register("role")}
            >
              <option value="">Select a role...</option>
              <option value="USER">Normal User</option>
              <option value="OWNER">Store Owner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
            {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={createMutation.isPending}>
            Create User
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
