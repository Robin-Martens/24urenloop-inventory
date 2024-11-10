import { Handler } from "express";

import { pass, route } from "../router.ts";
import { dataResultFromPromise } from "../utils.ts";

export function alive(): Handler {
  return route(() =>
    pass(dataResultFromPromise(async () => await Promise.resolve("OK"))),
  );
}
