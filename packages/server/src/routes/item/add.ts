import { route, Handler, parse } from "../../router.ts";
import { DataResult, dataResultFromPromise } from "../../utils.ts";
import { okAsync } from "neverthrow";
import { InventoryItemModel } from "../../models/InventoryItem.ts";
import { z } from "zod";
import { idSchema } from "../../types.ts";

export function add(): Handler {
  return route((req) =>
    parse(
      rawInventoryItemSchema,
      req.body,
      "Request path requires an item id!",
    ).map((item) => _addItem(item)),
  );
}

function _addItem(item: RawInventoryItem): DataResult<string> {
  return dataResultFromPromise(async () =>
    InventoryItemModel.create(item),
  ).andThen((res) => {
    return okAsync(res.id.toString());
  });
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
