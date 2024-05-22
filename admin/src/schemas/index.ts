import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().email({
    message: "Email is required",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().trim().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /[\p{Punct}\W]*/,
      "Password must contain at least one special character"
    )
    .regex(/\d+/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

export const ProductSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  price: z.coerce.number().min(1, {
    message: "Price is required",
  }),
  quantityAvailable: z.coerce.number().min(1, {
    message: "Quantity is required",
  }),
  categoryId: z.string().trim().min(1, {
    message: "Category is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
});

export const CategorySchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
});
