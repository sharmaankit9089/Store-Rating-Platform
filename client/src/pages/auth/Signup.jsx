import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/, "Password must be 8-16 chars, contain 1 uppercase and 1 special char"),
  address: z.string().max(400, "Address cannot exceed 400 characters").optional(),
});

const Signup = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/signup", data);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Address"
          type="text"
          placeholder="Enter your full address"
          {...register("address")}
          error={errors.address?.message}
        />
        
        <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
