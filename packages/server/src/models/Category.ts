import { model, Schema } from 'mongoose';

import { InventoryItemModel } from './InventoryItem';

export type Category = {
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export const categorySchema = new Schema<Category>(
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
categorySchema.pre('deleteOne', async () => {
  const items = await InventoryItemModel.find({}).exec();
  if (items.length !== 0) {
    throw new Error(
      'You tried deleting a category, for which items are associated. Try deleting those first.',
    );
  }
});

export const CategoryModel = model<Category>('CategoryModel', categorySchema);
