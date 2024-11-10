import { okAsync } from 'neverthrow';
import { z } from 'zod';

import { InventoryItemModel } from '../../models/InventoryItem.ts';
import { Handler, parse, route } from '../../router.ts';
import { idSchema } from '../../types.ts';
import { DataResult, dataResultFromPromise } from '../../utils.ts';

export function add(): Handler {
  return route(req =>
    parse(
      rawInventoryItemSchema,
      req.body,
      'Request path requires an item id!',
    ).map(item => _addItem(item)),
  );
}

function _addItem(item: RawInventoryItem): DataResult<string> {
  return dataResultFromPromise(async () =>
    InventoryItemModel.create(item),
  ).andThen(res => okAsync(res.id.toString()));
}

export const rawInventoryItemSchema = z
  .object({
    name: z.string().nonempty(),
    detailName: z.string().nullable(),
    amount: z.number().positive(),
    whereBought: z.string().nullable(),
    location: idSchema,
    category: idSchema,
  })
  .strict();
export type RawInventoryItem = z.infer<typeof rawInventoryItemSchema>;
