import { Router } from 'express'

import { add } from './add.ts'
import { deleteLocation } from './delete.ts'
import { get } from './get.ts'
import { list } from './list.ts'
import { put } from './put.ts'

export const locationRouter: Router = Router()

locationRouter.get('/list', list())
locationRouter.get('/get/:locationId', get())
locationRouter.put('/put', put())
locationRouter.post('/add', add())
locationRouter.delete('/delete/:locationId', deleteLocation())
