import { Types, Schema, model } from "mongoose";
import { LocationModel } from "./Location";
import { CategoryModel } from "./Category";

export type InventoryItem = {
  name: string;
  detailName: string | null;
  amount: number;
  whereBought: string | null;
  location: Types.ObjectId;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const inventoryItemSchema = new Schema<InventoryItem>(
  {
    name: { type: String, required: true },
    detailName: String,
    amount: { type: Number, required: true },
    whereBought: String,
    location: {
      type: Schema.Types.ObjectId,
      ref: "LocationModel",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
  },
  { timestamps: true },
);
inventoryItemSchema
  .path("location")
  .validate(
    async (value) => await LocationModel.findById(value),
    "Location does not exist.",
  );
inventoryItemSchema
  .path("category")
  .validate(
    async (value) => await CategoryModel.findById(value),
    "Category does not exist.",
  );

export const InventoryItemModel = model<InventoryItem>(
  "InventoryItemModel",
  inventoryItemSchema,
);
