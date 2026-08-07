import { z } from "zod";

export const ratingSchema = z.object({
  storeId: z.number().int().positive("Invalid store ID").optional(), // Optional for update
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});
