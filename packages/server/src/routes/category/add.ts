import { okAsync } from 'neverthrow'
import { z } from 'zod'

import { CategoryModel } from '../../models/Category.ts'
import { Handler, parse, route } from '../../router'
import { DataResult, dataResultFromPromise } from '../../utils'

export function add(): Handler {
  return route(req =>
    parse(addCategorySchema, req.body, 'Request path requires an item id!').map(
      category => _add(category),
    ),
  )
}

function _add(addCategoryInfo: AddCategoryInfo): DataResult<string> {
  return dataResultFromPromise(async () =>
    CategoryModel.create(addCategoryInfo),
  ).andThen(res => okAsync(res.id.toString()))
}

const addCategorySchema = z
  .object({
    name: z.string().nonempty(),
    color: z.string().nonempty(),
  })
  .strict()
type AddCategoryInfo = z.infer<typeof addCategorySchema>
