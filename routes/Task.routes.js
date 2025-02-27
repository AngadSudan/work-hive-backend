import { Router } from 'express';
import {
  createTask,
  changeTaskStatus,
  changeTaskPriority,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/Task.controllers.js';
const taskRouter = Router();

taskRouter.post('/create', createTask);
taskRouter.put('/change-status/:id', changeTaskStatus);
taskRouter.put('/change-priority/:id', changeTaskPriority);
taskRouter.post('/:id/add-review', addReview);
taskRouter.post('/:id/update-review', updateReview);
taskRouter.delete('/:id', deleteReview);
export default taskRouter;
