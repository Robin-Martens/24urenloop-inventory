import { Router } from "express";
import { list } from "./list.ts";
import { get } from "./get.ts";
import { add } from "./add.ts";
import { deleteItem } from "./delete.ts";
import { putItem } from "./put.ts";

export const itemRouter: Router = Router();

itemRouter.get("/list", list());
itemRouter.get("/get/:itemId", get());
itemRouter.put("/put", putItem());
itemRouter.post("/add", add());
itemRouter.delete("/delete/:itemId", deleteItem());
