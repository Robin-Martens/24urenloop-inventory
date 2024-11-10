import { errAsync, okAsync } from 'neverthrow'
import { z } from 'zod'

import * as Errors from '../../errors.ts'
import { CategoryModel } from '../../models/Category.ts'
import { Handler, parse, route } from '../../router'
import { DataResult, dataResultFromPromise } from '../../utils'

const putCategorySchema = z.object({
  id: z
    .string()
    .length(24)
    .regex(/[0-9A-Fa-f]+/g),
  name: z.string().nonempty().optional(),
  color: z.string().nonempty().optional(),
})
type PutCategorySchema = z.infer<typeof putCategorySchema>

export function put(): Handler {
  return route(req =>
    parse(putCategorySchema, req.body, 'Request path requires an item id!').map(
      item => _put(item),
    ),
  )
}

function _put(category: PutCategorySchema): DataResult<string> {
  const { id, ...cat } = category

  return dataResultFromPromise(async () =>
    CategoryModel.updateOne({ _id: id }, { ...cat }),
  ).andThen(res => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          'The delete request is not acknowledged by the database. Please try again.',
        ),
      )
    }

    if (res.matchedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The category with id '${id}' was not found, so no categories have been updated.`,
        ),
      )
    }

    return okAsync(id.toString())
  })
}
