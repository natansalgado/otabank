import TransactionsRepository, { Transaction } from '../models/transactions';
import AccountsRepository, { Account } from '../models/accounts';
import sequelize from '../db';

type TransactionInfos = Pick<Transaction, 'accountId' | 'type' | 'accountToId' | 'value'>;

export type Infos = {
  account: string | number;
  type: string;
  toAccount?: string | number;
  value?: string | number;
};

const errorMessages = {
  invalidIdFormat: 'Invalid ID format, use a integer number.',
  transactionNotExists: "Transaction doesn't exists.",
  invalidAccountNumber: 'The account number needs to be an integer number.',
  accountNotExists: "Account doesn't exists.",
  transferRequiresAccountToId: "To make a transfer, the target account number needs to be declared with 'toAccount'.",
  invalidTargetAccountNumber: 'The Target account number needs to be an integer number.',
  targetAccountNotExists: "Target account doesn't exist.",
  invalidTransactionType: "The type needs to be 'balance' | 'transfer' | 'withdraw' | 'deposit'",
  insufficientFunds: 'Insufficient funds.',
};

const findAll = async (): Promise<Transaction[]> => {
  const transactions = await TransactionsRepository.findAll();

  return transactions;
};

const findTransaction = async (id: string): Promise<Transaction | Error> => {
  if (!Number.isInteger(Number(id))) return new Error(errorMessages.invalidIdFormat);

  const transaction = await TransactionsRepository.findByPk(id);

  if (!transaction) return new Error(errorMessages.transactionNotExists);

  return transaction;
};

const addTransaction = async (infos: Infos): Promise<Transaction | Error> => {
  if (!Number.isInteger(Number(infos.account))) return new Error(errorMessages.invalidAccountNumber);

  const validTypes = ['balance', 'transfer', 'withdraw', 'deposit'];

  if (!validTypes.includes(infos.type)) {
    return new Error(errorMessages.invalidTransactionType);
  }

  const accountId = await AccountsRepository.findOne({
    where: { number: infos.account },
  });
  if (!accountId) return new Error(errorMessages.accountNotExists);

  let accountToId = null;

  if (infos.type === 'transfer') {
    if (!infos.toAccount) {
      return new Error(errorMessages.transferRequiresAccountToId);
    }

    if (!Number.isInteger(Number(infos.toAccount))) return new Error(errorMessages.invalidTargetAccountNumber);

    accountToId = await AccountsRepository.findOne({
      where: { number: infos.toAccount },
    });
    if (!accountToId) return new Error(errorMessages.targetAccountNotExists);
  }

  const transaction: TransactionInfos = {
    accountId: accountId.id,
    type: infos.type,
    accountToId: accountToId?.id,
    value: Number(infos.value),
  };

  switch (infos.type) {
    case 'balance':
      break;
    case 'transfer':
      if (accountId.balance < Number(infos.value)) return new Error(errorMessages.insufficientFunds);
      await performTransaction(accountId, accountToId, Number(infos.value));
      break;
    case 'deposit':
      await performTransaction(accountId, null, -Number(infos.value));
      break;
    case 'withdraw':
      if (accountId.balance < Number(infos.value)) return new Error(errorMessages.insufficientFunds);
      await performTransaction(accountId, null, Number(infos.value));
      break;
    default:
      break;
  }

  const createdTransaction = TransactionsRepository.create(transaction);
  return createdTransaction;
};

const performTransaction = async (sourceAccount: Account, targetAccount: Account | null, amount: number) => {
  await sequelize.transaction(async (t) => {
    await AccountsRepository.update(
      { balance: sourceAccount.balance - amount },
      { where: { id: sourceAccount.id }, transaction: t },
    );

    if (targetAccount) {
      await AccountsRepository.update(
        { balance: targetAccount.balance + amount },
        { where: { id: targetAccount.id }, transaction: t },
      );
    }
  });
};

const deleteTransaction = async (id: string) => {
  if (!Number.isInteger(Number(id))) return new Error(errorMessages.invalidIdFormat);

  const transaction = await TransactionsRepository.findByPk(id);

  if (!transaction) return new Error(errorMessages.transactionNotExists);

  await TransactionsRepository.destroy({ where: { id } });

  return transaction;
};

export default {
  findAll,
  findTransaction,
  addTransaction,
  deleteTransaction,
};
