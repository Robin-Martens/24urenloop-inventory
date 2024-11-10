import { route, Handler, parse } from "../../router";
import { categorySchema } from "../../types";
import { DataResult, dataResultFromPromise } from "../../utils";
import { okAsync } from "neverthrow";
import { z } from "zod";
import { CategoryModel } from "../../models/Category.ts";

const addCategorySchema = z.object({
  name: z.string().nonempty(),
  color: z.string().nonempty(),
});

export function add(): Handler {
  return route((req) =>
    parse(categorySchema, req.body, "Request path requires an item id!").map(
      (category) => _add(category),
    ),
  );
}

function _add(addCategoryInfo: AddCategoryInfo): DataResult<string> {
  return dataResultFromPromise(async () =>
    CategoryModel.create(addCategoryInfo),
  ).andThen((res) => okAsync(res.id.toString()));
}
type AddCategoryInfo = z.infer<typeof addCategorySchema>;
