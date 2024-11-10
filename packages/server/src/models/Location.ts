import * as mongoose from "mongoose";
import { model } from "mongoose";
import { InventoryItemModel } from "./InventoryItem";

const Schema = mongoose.Schema;

export type Location = {
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export const locationSchema = new Schema<Location>(
  {
    name: { type: String, required: true },
    color: {
      type: String,
      match: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
      required: true,
    },
  },
  { timestamps: true },
);
locationSchema.pre("deleteOne", async function () {
  const items = await InventoryItemModel.find({}).exec();
  if (items.length !== 0) {
    throw new Error(
      "You tried deleting a location, for which items are associated. Try deleting those first.",
    );
  }
});

export const LocationModel = model<Location>("LocationModel", locationSchema);
