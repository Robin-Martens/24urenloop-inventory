import { route, Handler, parse } from "../../router";
import { DataResult, dataResultFromPromise } from "../../utils";
import * as Errors from "../../errors.ts";
import { errAsync, okAsync } from "neverthrow";
import { idSchema } from "../../types.ts";
import { LocationModel } from "../../models/Location.ts";

export function deleteLocation(): Handler {
  return route((req) =>
    parse(
      idSchema,
      req.params.locationId,
      "Request path requires an location id!",
    ).map((locationId) => _delete(locationId)),
  );
}

function _delete(locationId: string): DataResult<string> {
  return dataResultFromPromise(async () => {
    return LocationModel.deleteOne({ _id: locationId });
  }).andThen((res) => {
    if (!res.acknowledged) {
      return errAsync(
        Errors.serverError(
          "The delete request is not acknowledged by the database. Please try again.",
        ),
      );
    }

    if (res.deletedCount === 0) {
      return errAsync(
        Errors.notFound(
          `The location with id '${locationId}' was not found, so no locations have been deleted.`,
        ),
      );
    }

    return okAsync(locationId);
  });
}
