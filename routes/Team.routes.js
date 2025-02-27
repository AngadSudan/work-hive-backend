import { Router } from 'express';
import {
  createTeam,
  changeTeamStatus,
  updateLeader,
  addSubTeam,
  removeSubTeam,
  deleteTeam,
} from '../controllers/Team.controllers.js';
const teamRouter = Router();

teamRouter.post('/createTeam', createTeam);
teamRouter.put('/:id/change-status', changeTeamStatus);
teamRouter.put('/:id/update-leader', updateLeader);
teamRouter.patch('/:id/add-subteam', addSubTeam);
teamRouter.patch('/:id/remove-subteam', removeSubTeam);
teamRouter.delete('/:id', deleteTeam);
export default teamRouter;
