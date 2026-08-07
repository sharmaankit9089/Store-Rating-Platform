import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      toast.success("Login successful!");
      navigate(`/${response.data.user.role.toLowerCase()}`, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Sign in to your account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-dark hover:bg-primary text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary-dark hover:underline font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
