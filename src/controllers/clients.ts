import { Request, Response } from 'express';
import ClientServices from '../services/clients';
import AppError from '../appError';

const findAll = async (req: Request, res: Response) => {
  const result = await ClientServices.findAll();

  return res.json(result);
};

const findClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ClientServices.findClient(id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const addClient = async (req: Request, res: Response) => {
  const client = req.body;

  const result = await ClientServices.addClient(client);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = req.body;

  const result = await ClientServices.updateClient(id, client);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ClientServices.deleteClient(id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

export default { findAll, findClient, addClient, updateClient, deleteClient };
