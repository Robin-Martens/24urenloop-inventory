import { Router } from "express";
import { list } from "./list.ts";
import { get } from "./get.ts";
import { add } from "./add.ts";
import { deleteCategory } from "./delete.ts";
import { put } from "./put.ts";

export const categoryRouter: Router = Router();

categoryRouter.get("/list", list());
categoryRouter.get("/get/:categoryId", get());
categoryRouter.put("/put", put());
categoryRouter.post("/add", add());
categoryRouter.delete("/delete/:categoryId", deleteCategory());
