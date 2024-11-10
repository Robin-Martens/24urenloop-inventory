import { z } from "zod";
import { route, Handler, parse } from "../../router.ts";
import { DataResult, dataResultFromPromise } from "../../utils.ts";
import { errAsync, okAsync } from "neverthrow";
import * as Errors from "../../errors.ts";
import {
  InventoryItem,
  InventoryItemModel,
} from "../../models/InventoryItem.ts";

const itemIdSchema = z.string();

export function get(): Handler {
  return route((req) =>
    parse(
      itemIdSchema,
      req.params.itemId,
      "Request path requires an item id!",
    ).map((itemId) => _get(itemId)),
  );
}

function _get(itemId: string): DataResult<InventoryItem> {
  return dataResultFromPromise(async () => {
    return InventoryItemModel.findById(itemId)
      .populate(["location", "category"])
      .exec();
  }).andThen((item) => {
    if (item === null) {
      return errAsync(Errors.notFound());
    }

    return okAsync(item.toObject());
  });
}
