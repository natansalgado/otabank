import { Router } from 'express';
import clients from '../controllers/clients';

const routes = Router();

routes.get('/', clients.findAll);
routes.get('/:id', clients.findClient);
routes.post('/', clients.addClient);
routes.patch('/:id', clients.updateClient);
routes.delete('/:id', clients.deleteClient);

export default routes;
