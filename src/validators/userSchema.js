import { z } from "zod";

export const addNewUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name too short").trim().toLowerCase(),
    last_name: z.string().min(2).trim().toLowerCase(),
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10).max(20).optional(),
    dob: z.string().date().optional(),
    gender: z.enum(["m", "f", "o"]),
    address: z.string().max(255),
    role: z
      .enum(["super_admin", "artist_manager", "artist"])
      .default("super_admin"),
  }),
});

export const updateUserSchema = addNewUserSchema.partial();
