import { Router } from 'express';
import {
  createProject,
  updateProject,
  findProjectById,
  findByProjectStatus,
  findByPriortiy,
  changeProjectStatus,
  changePriority,
  updatePRD,
} from '../controllers/Project.controllers.js';

const projectRouter = Router();
projectRouter.get('/:id', findProjectById);
projectRouter.post('/', createProject);
projectRouter.put('/:id', updateProject);
projectRouter.get('/status/:status', findByProjectStatus);
projectRouter.get('/priority/:priority', findByPriortiy);
projectRouter.put('/status/:id', changeProjectStatus);
projectRouter.put('/priority/:id', changePriority);

export default projectRouter;
