import { Router, Request, Response } from 'express';
import clients from './controllers/clients';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Tudo certo!' });
});

routes.post('/clients', clients.addClient);
routes.get('/clients', clients.findAll);
routes.get('/clients/:id', clients.findClient);
routes.patch('/clients/:id', clients.updateClient);
routes.delete('/clients/:id', clients.deleteClient)

export { routes as default };
