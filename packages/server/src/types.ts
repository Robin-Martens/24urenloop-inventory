import { ObjectId } from "mongodb";
import { z } from "zod";

export const categorySchema = z
  .object({
    name: z.string().nonempty(),
    color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  })
  .strict();
export type Category = z.infer<typeof categorySchema>;
export type CategoryWithId = Category & { id: ObjectId };

export const locationSchema = z
  .object({
    name: z.string().nonempty(),
    color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  })
  .strict();
export type Location = z.infer<typeof locationSchema>;
export type LocationWithId = Location & { id: ObjectId };

export const idSchema = z
  .string()
  .length(24)
  .regex(/[0-9A-Fa-f]+/g);

export type InventoryItemWithId = RawInventoryItem & {
  id: ObjectId;
};
export const inventoryItemSchema = z
  .object({
    name: z.string().nonempty(),
    detailName: z.string().nullable(),
    amount: z.number().positive(),
    whereBought: z.string().nullable(),
    location: locationSchema,
    category: categorySchema,
  })
  .strict();
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
