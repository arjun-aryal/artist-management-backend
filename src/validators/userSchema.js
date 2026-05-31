import { z } from "zod";

export const UserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name too short").trim().toLowerCase(),
    last_name: z.string().min(2).trim().toLowerCase(),
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10).max(20).optional(),
    dob: z.string().date().optional(),
    gender: z.enum(["m", "f", "o"]),
    address: z.string().max(255),
    role_type: z
      .enum(["super_admin", "artist_manager"])
      .default("artist_manager"),
  }),
  params: z.object({
    id: z.coerce.number().int().positive().optional(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    role_type: z.string().optional().optional(),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(["ASC", "DESC"]).default("ASC"),
  }),
});

export const ArtistSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10).max(20).optional(),
    name: z.string().min(2, "Artist name is required").trim(),
    dob: z.string().date(),
    gender: z.enum(["m", "f", "o"]),
    address: z.string().max(255),
    first_release_year: z.coerce
      .number()
      .int()
      .min(1700, "First release year must be after 1700"),

    no_of_albums_released: z.coerce.number().int().min(0).default(0),
  }),
  params: z.object({
    id: z.coerce.number().int().positive().optional(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(["ASC", "DESC"]).default("ASC"),
  }),
});

export const updateUserSchema = UserSchema.partial();
export const updateArtistSchema = ArtistSchema.partial();
