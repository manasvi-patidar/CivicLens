import { z } from "zod";

// This schema is used by the ADMIN-only endpoint that creates ADMIN, AUTHORITY, and VOLUNTEER accounts.
export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["ADMIN", "AUTHORITY", "VOLUNTEER"]),
});
