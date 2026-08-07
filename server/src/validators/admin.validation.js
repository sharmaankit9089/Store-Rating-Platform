import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(20, "Name must be at least 20 characters long")
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
  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters")
    .optional(),
  role: z.enum(["ADMIN", "USER", "OWNER"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be ADMIN, USER, or OWNER",
  }),
});

export const createStoreSchema = z.object({
  name: z.string({ required_error: "Store name is required" }),
  email: z
    .string({ required_error: "Store email is required" })
    .email("Invalid email address"),
  address: z.string({ required_error: "Store address is required" }),
  ownerId: z
    .number({ required_error: "Owner ID is required", invalid_type_error: "Owner ID must be a number" })
    .int()
    .positive(),
});

export const updateStoreSchema = createStoreSchema.partial();
export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().optional(),
});
