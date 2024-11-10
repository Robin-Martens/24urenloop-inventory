import { okAsync } from 'neverthrow';
import { z } from 'zod';

import { LocationModel } from '../../models/Location.ts';
import { Handler, parse, route } from '../../router';
import { DataResult, dataResultFromPromise } from '../../utils';

const addLocationSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().nonempty(),
});

export function add(): Handler {
  return route(req =>
    parse(
      addLocationSchema,
      req.body,
      'Request path requires an location id!',
    ).map(location => _add(location)),
  );
}

function _add(location: AddLocationInfo): DataResult<string> {
  return dataResultFromPromise(async () =>
    LocationModel.create(location),
  ).andThen(res => okAsync(res.id.toString()));
}

type AddLocationInfo = z.infer<typeof addLocationSchema>;
