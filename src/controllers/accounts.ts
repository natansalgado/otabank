import { Request, Response } from 'express';
import AccountsServices from '../services/accounts';
import AppError from '../appError';

const findAll = async (req: Request, res: Response) => {
  const result = await AccountsServices.findAll();

  return res.json(result);
};

const findAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AccountsServices.findAccount(id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const addAccount = async (req: Request, res: Response) => {
  const { clientId } = req.body;

  const result = await AccountsServices.addAccount(clientId);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AccountsServices.deleteAccount(id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

export default { findAll, findAccount, addAccount, deleteAccount };
