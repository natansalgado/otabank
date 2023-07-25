import { Request, Response } from 'express';
import ClientServices from '../services/clients';

const findAll = async (req: Request, res: Response) => {
  const result = await ClientServices.findAll();

  return res.json(result);
};

const findClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ClientServices.findClient(id);

  if (result instanceof Error) return res.status(404).json(result.message);

  return res.json(result);
};

const addClient = async (req: Request, res: Response) => {
  const client = req.body;

  const result = await ClientServices.addClient(client);

  if (result instanceof Error) return res.status(400).json(result.message);

  return res.json(result);
};

const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = req.body;

  const result = await ClientServices.updateClient(id, client);

  if (result instanceof Error) return res.status(404).json(result.message);

  return res.json(result);
};

const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ClientServices.deleteClient(id);

  if (result instanceof Error) return res.status(404).json(result.message);

  return res.json(result);
};

export default { findAll, findClient, addClient, updateClient, deleteClient };
