import { z } from "zod";

export const registrationSchema = z.object({
  first_name: z.string().min(2, "First name too short").trim().toLowerCase(),
  last_name: z.string().min(2).trim().toLowerCase(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10).max(20).optional(),
  dob: z.string().date().optional(),
  gender: z.enum(["m", "f", "o"]).optional(),
  address: z.string().max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
