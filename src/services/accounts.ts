import AccountsRepository, { Account } from '../models/accounts';
import ClientsRepository from '../models/clients';

type AccountInfos = Pick<Account, 'number' | 'clientId' | 'balance'>;

const findAll = async (): Promise<Account[]> => {
  const accounts = await AccountsRepository.findAll();

  return accounts;
};

const findAccount = async (id: string): Promise<Account | Error> => {
  if (!Number.isInteger(Number(id)))
    return new Error('Invalid ID format, use a integer number.');

  const account = await AccountsRepository.findByPk(id);

  if (!account) return new Error("Account doesn't exists.");

  return account;
};

const addAccount = async (id: string): Promise<Account | Error> => {
  if (!Number.isInteger(Number(id)))
    return new Error('Invalid ID format, use a integer number.');

  const clientExists = await ClientsRepository.findByPk(id);

  if (!clientExists) return new Error("Client doesn't exists.");

  const min = 10000000;
  const max = 99999999;
  const number = Math.floor(Math.random() * (max - min)) + min;

  const clientId = Number(id);

  const account = await AccountsRepository.create({
    clientId,
    number,
  });

  return account;
};

const addAmount = async (
  number: string,
  value: number,
): Promise<Account | Error> => {
  const accountExists = await AccountsRepository.findOne({ where: { number } });

  if (!accountExists) return new Error("Account doesn't exists.");

  await AccountsRepository.update(
    { balance: Number(accountExists.balance) + value },
    { where: { number: number } },
  );

  const account = await AccountsRepository.findOne({ where: { number } });
  if (account) return account;

  return new Error('');
};

const deleteAccount = async (id: string): Promise<Account | Error> => {
  if (!Number.isInteger(Number(id)))
    return new Error('Invalid ID format, use a integer number.');

  const accountExists = await AccountsRepository.findByPk(id);

  if (!accountExists) return new Error("Account doesn't exists.");

  await AccountsRepository.destroy({ where: { id } });

  return accountExists;
};

export default { findAll, findAccount, addAccount, addAmount, deleteAccount };
