import { Router } from 'express';
import {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
} from '../controllers/Organization.controllers.js';

const organizationRouter = Router();

organizationRouter.get('/:id', getOrganizationById);
organizationRouter.post('/', createOrganization);
organizationRouter.put('/:id', updateOrganization);
organizationRouter.delete('/:id', deleteOrganization);

export default organizationRouter;
