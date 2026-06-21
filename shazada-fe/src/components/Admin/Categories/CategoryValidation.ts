import { z } from "zod";

export const CategorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title minimum 3 karakter.")
    .max(100, "Title maximum 100 karakter."),

  description: z
    .string()
    .trim()
    .max(500, "Description maximum 500 karakter.")
    .nullable()
    .optional(),

  icon_url: z.string().url("Icon URL tidak valid.").nullable().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
