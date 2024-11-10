import {
  InventoryItem,
  InventoryItemModel,
} from '../../models/InventoryItem.ts'
import { Handler, pass, route } from '../../router.ts'
import { DataResult, dataResultFromPromise } from '../../utils.ts'

export function list(): Handler {
  return route(_ => pass(listItems()))
}

function listItems(): DataResult<InventoryItem[]> {
  return dataResultFromPromise(async () =>
    InventoryItemModel.find({}).populate(['location', 'category']).exec(),
  )
}
