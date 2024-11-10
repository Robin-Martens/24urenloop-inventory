import { LocationModel } from '../../models/Location.ts'
import { Handler, pass, route } from '../../router.ts'
import { Location } from '../../types.ts'
import { DataResult, dataResultFromPromise } from '../../utils.ts'

export function list(): Handler {
  return route(_ => pass(listItems()))
}

function listItems(): DataResult<Location[]> {
  return dataResultFromPromise(async () => LocationModel.find({}))
}
