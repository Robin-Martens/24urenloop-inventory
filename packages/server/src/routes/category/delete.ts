import { errAsync, okAsync } from 'neverthrow';

import * as Errors from '../../errors.ts';
import { CategoryModel } from '../../models/Category.ts';
import { Handler, parse, route } from '../../router';
import { idSchema } from '../../types.ts';
import { DataResult, dataResultFromPromise } from '../../utils';

export function deleteCategory(): Handler {
  return route(req =>
    parse(
      idSchema,
      req.params.categoryId,
      'Request path requires an category id!',
    ).map(categoryId => _delete(categoryId)),
  );
}

function _delete(categoryId: string): DataResult<string> {
  return dataResultFromPromise(async () =>
    CategoryModel.deleteOne({ _id: categoryId }),
  ).andThen(res => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          'The delete request is not acknowledged by the database. Please try again.',
        ),
      );
    }

    if (res.deletedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The category with id '${categoryId}' was not found, so no categories have been deleted.`,
        ),
      );
    }

    return okAsync(categoryId);
  });
}
