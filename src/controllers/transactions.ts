import { Request, Response } from 'express';
import TransactionsServices from '../services/transactions';
import AppError from '../appError';

const findAll = async (req: Request, res: Response) => {
  const result = await TransactionsServices.findAll();

  return res.json(result);
};

const findTransaction = async (req: Request, res: Response) => {
  const result = await TransactionsServices.findTransaction(req.params.id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const addTransaction = async (req: Request, res: Response) => {
  const result = await TransactionsServices.addTransaction(req.body);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

const deleteTransaction = async (req: Request, res: Response) => {
  const result = await TransactionsServices.deleteTransaction(req.params.id);

  if (result instanceof AppError) return res.status(result.status).json(result.message);

  return res.json(result);
};

export default {
  findAll,
  findTransaction,
  addTransaction,
  deleteTransaction,
};
