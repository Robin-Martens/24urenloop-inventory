import { CategoryModel } from "../../models/Category.ts";
import { Handler, pass, route } from "../../router.ts";
import { Category } from "../../types.ts";
import { DataResult, dataResultFromPromise } from "../../utils.ts";

export function list(): Handler {
  return route((_) => pass(listItems()));
}

function listItems(): DataResult<Category[]> {
  return dataResultFromPromise(async () => CategoryModel.find({}));
}
