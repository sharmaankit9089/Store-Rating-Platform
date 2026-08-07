import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(60, "Name cannot exceed 60 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/,
      "Password must be 8-16 characters long, contain at least one uppercase letter and one special character"
    ),
  address: z.string().max(400, "Address cannot exceed 400 characters").optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z.string({ required_error: "Password is required" }),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string({ required_error: "Old password is required" }),
  newPassword: z
    .string({ required_error: "New password is required" })
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/,
      "Password must be 8-16 characters long, contain at least one uppercase letter and one special character"
    ),
});
