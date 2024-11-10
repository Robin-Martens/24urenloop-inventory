import { errAsync, okAsync } from 'neverthrow';

import * as Errors from '../../errors.ts';
import { CategoryModel } from '../../models/Category.ts';
import { Handler, parse, route } from '../../router';
import { Category, idSchema } from '../../types';
import { DataResult, dataResultFromPromise } from '../../utils';

export function get(): Handler {
  return route(req =>
    parse(
      idSchema,
      req.params.categoryId,
      'Request path requires a category id!',
    ).map(categoryId => getCategory(categoryId)),
  );
}

export function getCategory(categoryId: string): DataResult<Category> {
  return dataResultFromPromise(async () =>
    CategoryModel.findById(categoryId),
  ).andThen(category => {
    if (category === null) {
      return errAsync(Errors.notFound());
    }
    return okAsync(category as unknown as Category);
  });
}
