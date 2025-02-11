import { Router } from 'express'
import { TimeRecordController } from '../controllers/TimeRecordController'
import { adminMiddleware } from '../middlewares/admin'

const timeRecordsRoutes = Router()
const timeRecordController = new TimeRecordController()

timeRecordsRoutes.get('/today', adminMiddleware, timeRecordController.getTodayRecords.bind(timeRecordController))
timeRecordsRoutes.post('/', timeRecordController.create.bind(timeRecordController))

export { timeRecordsRoutes }
