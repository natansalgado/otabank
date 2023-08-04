import TransactionsServices, { Infos } from './transactions';
import AccountsServices from './accounts';
import ClientsServices from './clients';
import { Transaction } from '../models/transactions';
import { Account } from '../models/accounts';
import { errorMessages } from '../errorMessages';

describe('Accounts Services', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  const transactionData = (
    account: number | string,
    type?: string | null,
    value?: number | string,
    toAccount?: number | string,
  ) => {
    return {
      account,
      type,
      toAccount,
      value,
    } as Infos;
  };

  describe('Find All the transactions', () => {
    it('should be able to return all the transactions.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount1 = await AccountsServices.addAccount('1');
      const createdAccount2 = await AccountsServices.addAccount('1');

      const deposit = transactionData((createdAccount1 as Account).number, 'deposit', 200);
      const transfer = transactionData((createdAccount1 as Account).number, 'transfer', 100, (createdAccount2 as Account).number);
      const withdraw = transactionData((createdAccount1 as Account).number, 'withdraw', 100);
      const balan = transactionData((createdAccount1 as Account).number, 'balance');

      const deposited = await TransactionsServices.addTransaction(deposit);
      const transfered = await TransactionsServices.addTransaction(transfer);
      const withdrawn = await TransactionsServices.addTransaction(withdraw);
      const balance = await TransactionsServices.addTransaction(balan);

      const transactions = await TransactionsServices.findAll();

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount1).toHaveProperty('id');
      expect(createdAccount2).toHaveProperty('id');
      expect(deposited).toHaveProperty('id');
      expect(transfered).toHaveProperty('id');
      expect(withdrawn).toHaveProperty('id');
      expect(balance).toHaveProperty('id');
      expect(transactions).toHaveLength(4);
    });
  });

  describe('Find a transaction by id', () => {
    it('should be able to return one transaction.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');

      const deposit = transactionData((createdAccount as Account).number, 'deposit', 200);
      const createdTransaction = await TransactionsServices.addTransaction(deposit);

      const transaction = await TransactionsServices.findTransaction('1');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(createdTransaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('id');
      expect((transaction as Transaction).value).toBe('200.00');
    });

    it('should not be able to return a nonesxistent transaction.', async () => {
      const transaction = await TransactionsServices.findTransaction('1');

      expect(transaction).toEqual(Error(errorMessages.transactionNotExists));
    });

    it('should not be able to return an transaction with invalid id format.', async () => {
      const transaction = await TransactionsServices.findTransaction('a');

      expect(transaction).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });

  describe('Add an transaction', () => {
    it('should be able to add a new transaction.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');

      const deposit = transactionData((createdAccount as Account).number, 'deposit', 200);
      const transaction = await TransactionsServices.addTransaction(deposit);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transaction).toHaveProperty('id');
      expect((transaction as Transaction).value).toBe('200.00');
    });

    it('should not be able to create a transaction with invalid account number format.', async () => {
      const invalid = await TransactionsServices.addTransaction(transactionData('a'));

      expect(invalid).toEqual(Error(errorMessages.invalidAccountNumber));
    });

    it('should not be able to create a transaction with invalid transaction type.', async () => {
      const invalidData = transactionData(1, 'a');
      const invalid = await TransactionsServices.addTransaction(invalidData);

      expect(invalid).toEqual(Error(errorMessages.invalidTransactionType));
    });

    it('should not be able to create a transaction with a invalid value.', async () => {
      const transferData = transactionData(1, 'withdraw', 'a');
      const invalid = await TransactionsServices.addTransaction(transferData);

      expect(invalid).toEqual(Error(errorMessages.valueIsNaN));
    });

    it('should not be able to create a transaction with a negative value.', async () => {
      const withdrawData = transactionData(1, 'withdraw', -100);
      const invalid = await TransactionsServices.addTransaction(withdrawData);

      expect(invalid).toEqual(Error(errorMessages.negativeValue));
    });

    it('should not be able to create a transaction with a nonesxistent account', async () => {
      const invalid = await TransactionsServices.addTransaction(transactionData(1, 'withdraw'));

      expect(invalid).toEqual(Error(errorMessages.accountNotExists));
    });

    it('should not be able to create a transfer transaction without an account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transferData = transactionData((createdAccount as Account).number, 'transfer');
      const transfer = await TransactionsServices.addTransaction(transferData);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error(errorMessages.transferRequiresAccountToId));
    });

    it('should not be able to create a transfer transaction with an invalid account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transferData = transactionData((createdAccount as Account).number, 'transfer', 200, 'a');
      const transfer = await TransactionsServices.addTransaction(transferData);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error(errorMessages.invalidTargetAccountNumber));
    });

    it('should not be able to create a transfer transaction with a nonexistent account target number.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transferData = transactionData((createdAccount as Account).number, 'transfer', '', 1);
      const transfer = await TransactionsServices.addTransaction(transferData);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error(errorMessages.targetAccountNotExists));
    });

    it('should not be able to create a transfer transaction with insufficient founds.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const accountNumber = (createdAccount as Account).number;
      const transferData = transactionData(accountNumber, 'transfer', '100', accountNumber);
      const transfer = await TransactionsServices.addTransaction(transferData);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error(errorMessages.insufficientFunds));
    });

    it('should not be able to create a withdraw transaction with insufficient founds.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const transferData = transactionData((createdAccount as Account).number, 'withdraw', 100);
      const transfer = await TransactionsServices.addTransaction(transferData);

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(transfer).not.toHaveProperty('id');
      expect(transfer).toEqual(Error(errorMessages.insufficientFunds));
    });
  });

  describe('Delete an transaction', () => {
    it('should be able to delete an transaction', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const balanceData = transactionData((createdAccount as Account).number, 'balance');
      const createdTransaction = await TransactionsServices.addTransaction(balanceData);

      const deletedTransaction = await TransactionsServices.deleteTransaction('1');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(createdTransaction).toHaveProperty('id');
      expect(deletedTransaction).toHaveProperty('id');
    });

    it('should not be able to delete a nonesxistent transaction.', async () => {
      const transaction = await TransactionsServices.deleteTransaction('1');

      expect(transaction).not.toHaveProperty('id');
      expect(transaction).toEqual(Error(errorMessages.transactionNotExists));
    });

    it('should not be able to delete an transaction with invalid id format.', async () => {
      const transaction = await TransactionsServices.deleteTransaction('a');

      expect(transaction).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });
});
