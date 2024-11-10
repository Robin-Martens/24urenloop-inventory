import { errAsync, okAsync } from 'neverthrow'
import { z } from 'zod'

import * as Errors from '../../errors.ts'
import { InventoryItemModel } from '../../models/InventoryItem.ts'
import { Handler, parse, route } from '../../router.ts'
import { DataResult, dataResultFromPromise } from '../../utils.ts'

const itemIdSchema = z.string().nonempty()

export function deleteItem(): Handler {
  return route(req =>
    parse(
      itemIdSchema,
      req.params.itemId,
      'Request path requires an item id!',
    ).map(itemId => _deleteItem(itemId)),
  )
}

function _deleteItem(itemId: string): DataResult<string> {
  return dataResultFromPromise(async () =>
    InventoryItemModel.deleteOne({ _id: itemId }),
  ).andThen(res => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          'The delete request is not acknowledged by the database. Please try again.',
        ),
      )
    }

    if (res.deletedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The item with id '${itemId}' was not found, so no items have been deleted.`,
        ),
      )
    }

    return okAsync(itemId)
  })
}
