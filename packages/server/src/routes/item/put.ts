import { route, Handler, parse } from "../../router.ts";
import { RawInventoryItem, rawInventoryItemSchema } from "../../types.ts";
import { DataResult, dataResultFromPromise } from "../../utils.ts";
import { context } from "../../context.ts";
import { errAsync, okAsync } from "neverthrow";
import { z } from "zod";
import * as Errors from "../../errors.ts";
import { ObjectId } from "mongodb";

const putInventorySchema = rawInventoryItemSchema.extend({
  id: z
    .string()
    .length(24)
    .regex(/[0-9A-Fa-f]+/g),
});
type PutInventorySchema = z.infer<typeof putInventorySchema>;

export function putItem(): Handler {
  return route((req) =>
    parse(
      putInventorySchema,
      req.body,
      "Request path requires an item id!",
    ).map((item) => _putItem(item)),
  );
}

function _putItem(item: PutInventorySchema): DataResult<RawInventoryItem> {
  const { collections } = context();
  const { id, ...inventoryItem } = item;

  return dataResultFromPromise(async () => {
    const query = { _id: new ObjectId(id) };

    return collections.items.updateOne(query, {
      $set: inventoryItem,
    });
  }).andThen((res) => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          "The delete request is not acknowledged by the database. Please try again.",
        ),
      );
    }

    if (res.matchedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The item with id '${id}' was not found, so no items have been updated.`,
        ),
      );
    }

    return okAsync(item);
  });
}
