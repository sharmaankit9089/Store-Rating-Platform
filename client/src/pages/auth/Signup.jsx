import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const signupSchema = z.object({
  name: z.string().min(20, "Name must be at least 20 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/,
      "8-16 chars, 1 uppercase, 1 special character"
    ),
  address: z.string().max(400).optional(),
});

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/signup", data);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Create a User Account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register("name")}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
          <textarea
            {...register("address")}
            rows={2}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-dark hover:bg-primary text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-dark hover:underline font-semibold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
