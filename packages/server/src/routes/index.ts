import { Router } from 'express';

import { alive } from './alive';
import { categoryRouter } from './category';
import { itemRouter } from './item';
import { locationRouter } from './location';

export const rootRouter: Router = Router();

rootRouter.use('/item', itemRouter);
rootRouter.use('/category', categoryRouter);
rootRouter.use('/location', locationRouter);
rootRouter.get('/alive', alive());
