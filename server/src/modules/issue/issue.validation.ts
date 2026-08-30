import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),

  category: z.enum([
    "ROAD",
    "WATER",
    "ELECTRICITY",
    "GARBAGE",
    "STREETLIGHT",
    "DRAINAGE",
    "PUBLIC_PROPERTY",
    "OTHER",
  ]),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  latitude: z.coerce.number(),

  longitude: z.coerce.number(),

  address: z.string().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const updateIssueStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"]), //status cannot be updated
});

export const updateIssueSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  category: z
    .enum([
      "ROAD",
      "WATER",
      "ELECTRICITY",
      "GARBAGE",
      "STREETLIGHT",
      "DRAINAGE",
      "PUBLIC_PROPERTY",
      "OTHER",
    ])
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  latitude: z.coerce.number().optional(),

  longitude: z.coerce.number().optional(),

  address: z.string().optional(),
});
