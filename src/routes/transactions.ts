import { Router } from 'express';
import transactions from '../controllers/transactions';

const routes = Router();

routes.get('/', transactions.findAll);
routes.get('/:id', transactions.findTransaction);
routes.post('/', transactions.addTransaction);
routes.delete('/:id', transactions.deleteTransaction);

export default routes;
