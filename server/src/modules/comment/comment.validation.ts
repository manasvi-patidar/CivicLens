import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters")
    .max(500, "Comment cannot exceed 500 characters"),
});
