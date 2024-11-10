import { errAsync, okAsync } from 'neverthrow'

import * as Errors from '../../errors.ts'
import { Location, LocationModel } from '../../models/Location.ts'
import { Handler, parse, route } from '../../router'
import { idSchema } from '../../types'
import { DataResult, dataResultFromPromise } from '../../utils'

export function get(): Handler {
  return route(req =>
    parse(
      idSchema,
      req.params.locationId,
      'Request path requires an location id!',
    ).map(locationId => getLocation(locationId)),
  )
}

export function getLocation(locationId: string): DataResult<Location> {
  return dataResultFromPromise(async () =>
    LocationModel.findById(locationId),
  ).andThen(location => {
    if (location === null) {
      return errAsync(Errors.notFound())
    }
    return okAsync(location)
  })
}
