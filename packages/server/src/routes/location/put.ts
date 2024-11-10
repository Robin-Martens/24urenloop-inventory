import { errAsync, okAsync } from 'neverthrow';
import { z } from 'zod';

import * as Errors from '../../errors.ts';
import { LocationModel } from '../../models/Location.ts';
import { Handler, parse, route } from '../../router';
import { DataResult, dataResultFromPromise } from '../../utils';

const putLocationSchema = z.object({
  id: z
    .string()
    .length(24)
    .regex(/[0-9A-Fa-f]+/g),
  name: z.string().nonempty().optional(),
  color: z.string().nonempty().optional(),
});
type PutLocationSchema = z.infer<typeof putLocationSchema>;

export function put(): Handler {
  return route(req =>
    parse(putLocationSchema, req.body, 'Request path requires a location').map(
      item => _put(item),
    ),
  );
}

function _put(location: PutLocationSchema): DataResult<string> {
  const { id, ...loc } = location;

  return dataResultFromPromise(async () =>
    LocationModel.updateOne({ _id: id }, { ...loc }),
  ).andThen(res => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          'The delete request is not acknowledged by the database. Please try again.',
        ),
      );
    }

    if (res.matchedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The location with id '${id}' was not found, so no locations have been updated.`,
        ),
      );
    }

    return okAsync(id.toString());
  });
}
