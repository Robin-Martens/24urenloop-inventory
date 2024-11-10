import { Router } from "express";
import { itemRouter } from "./item";
import { categoryRouter } from "./category";
import { locationRouter } from "./location";
import { alive } from "./alive";

export const rootRouter: Router = Router();

rootRouter.use("/item", itemRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/location", locationRouter);
rootRouter.get("/alive", alive());
