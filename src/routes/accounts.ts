import { Router } from 'express';
import accounts from '../controllers/accounts';

const routes = Router();

routes.get('/', accounts.findAll);
routes.get('/:id', accounts.findAccount);
routes.post('/', accounts.addAccount);
routes.delete('/:id', accounts.deleteAccount);

export default routes;
