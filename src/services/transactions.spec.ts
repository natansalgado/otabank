import TransactionsServices, { Infos } from './transactions';
import AccountsServices from './accounts';
import ClientsServices from './clients';
import { Transaction } from '../models/transactions';
import { Account } from '../models/accounts';

describe('Accounts Services', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  const transactionData = (account: number | string) => {
    return {
      account,
      type: 'deposit',
      value: 200,
    } as Infos;
  };

  describe('Find All the transactions', () => {
    it('should be able to return all the transactions.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount1 = await AccountsServices.addAccount('1');
      const createdAccount2 = await AccountsServices.addAccount('1');

      const transactionsData: Infos[] = [
        transactionData((createdAccount1 as Account).number),
        {
          account: (createdAccount1 as Account).number,
          type: 'transfer',
          toAccount: (createdAccount2 as Account).number,
          value: 100,
        },
        {
          account: (createdAccount1 as Account).number,
          type: 'withdraw',
          value: 100,
        },
        {
          account: (createdAccount1 as Account).number,
          type: 'balance',
        },
      ];

      const deposited = await TransactionsServices.addTransaction(transactionsData[0]);
      const transfered = await TransactionsServices.addTransaction(transactionsData[1]);
      const withdrawn = await TransactionsServices.addTransaction(transactionsData[2]);
      const balance = await TransactionsServices.addTransaction(transactionsData[3]);

      const transactions = await TransactionsServices.findAll();

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount1).toHaveProperty('id');
      expect(createdAccount2).toHaveProperty('id');
      expect(deposited).toHaveProperty('id');
      expect(transfered).toHaveProperty('id');
      expect(withdrawn).toHaveProperty('id');
      expect(balance).toHaveProperty('id');
      expect(transactions).toHaveLength(transactionsData.length);
    });
  });

  describe('Find a transaction by id', () => {
    it('should be able to return one transaction.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');

      const createdTransaction = await TransactionsServices.addTransaction(transactionData((createdAccount as Account).number));

      const transaction = await TransactionsServices.findTransaction('1');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(createdTransaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('id');
      expect((transaction as Transaction).value).toBe('200.00');
    });

    it('should not be able to return a nonesxistent transaction.', async () => {
      const transaction = await TransactionsServices.findTransaction('1');

      expect(transaction).not.toHaveProperty('id');
      expect(transaction).toEqual(Error("Transaction doesn't exists."));
    });

    it('should not be able to return an transaction with invalid id format.', async () => {
      const transaction = await TransactionsServices.findTransaction('a');

      expect(transaction).not.toHaveProperty('id');
      expect(transaction).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });

  describe('Add an transaction', () => {
    it('should be able to add a new transaction.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');

      const transaction = await TransactionsServices.addTransaction(transactionData((createdAccount as Account).number));

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('id');
      expect((transaction as Transaction).value).toBe('200.00');
    });

    it('should not be able to create a transaction with a nonesxistent account', async () => {
      const transfer = await TransactionsServices.addTransaction(transactionData(1));

      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error("Account doesn't exists."));
    });

    it('should not be able to create a transaction with invalid account number format.', async () => {
      const transfer = await TransactionsServices.addTransaction(transactionData('a'));

      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error('The account number needs to be an integer number.'));
    });

    it('should not be able to create a transaction with invalid transaction type.', async () => {
      const transfer = await TransactionsServices.addTransaction({
        account: 1,
        type: 'a',
      });

      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error("The type needs to be 'balance' | 'transfer' | 'withdraw' | 'deposit'"));
    });

    it('should not be able to create a transfer transaction without an account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transfer = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'transfer',
      });

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error("To make a transfer, the target account number needs to be declared with 'toAccount'."));
    });

    it('should not be able to create a transfer transaction with an invalid account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transfer = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'transfer',
        toAccount: 'a',
      });

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error('The Target account number needs to be an integer number.'));
    });

    it('should not be able to create a transfer transaction with a nonexistent account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transfer = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'transfer',
        toAccount: 1,
      });

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error("Target account doesn't exist."));
    });

    it('should not be able to create a transfer transaction with insufficient founds.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transfer = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'transfer',
        toAccount: (createdAccount as Account).number,
        value: 100,
      });

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error('Insufficient funds.'));
    });

    it('should not be able to create a withdraw transaction with insufficient founds.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transfer = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'withdraw',
        value: 100,
      });

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error('Insufficient funds.'));
    });
  });

  describe('Delete an transaction', () => {
    it('should be able to delete an transaction', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const createdTransaction = await TransactionsServices.addTransaction({
        account: (createdAccount as Account).number,
        type: 'balance',
      });

      const deletedTransaction = await TransactionsServices.deleteTransaction('1');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(createdTransaction).toHaveProperty('id');
      expect(deletedTransaction).toHaveProperty('id');
    });

    it('should not be able to delete a nonesxistent transaction.', async () => {
      const transaction = await TransactionsServices.deleteTransaction('1');

      expect(transaction).not.toHaveProperty('id');
      expect(transaction).toEqual(Error("Transaction doesn't exists."));
    });

    it('should not be able to delete an transaction with invalid id format.', async () => {
      const transaction = await TransactionsServices.deleteTransaction('a');

      expect(transaction).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });
});
