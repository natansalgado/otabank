import { Account } from '../models/accounts';
import AccountsServices from './accounts';
import ClientsServices from './clients';
import { errorMessages } from '../errorMessages';

describe('Accounts Services', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  describe('Find All the accounts', () => {
    it('should be able to return all the accounts.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);

      const account1 = await AccountsServices.addAccount('1');
      const account2 = await AccountsServices.addAccount('1');

      const accounts = await AccountsServices.findAll();

      expect(createdClient).toHaveProperty('id');
      expect(account1).toHaveProperty('id');
      expect(account2).toHaveProperty('id');
      expect(accounts).toHaveLength(2);
    });
  });

  describe('Find an account by id', () => {
    it('should be able to return one account.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');
      const account = await AccountsServices.findAccount('1');

      expect(createdAccount).toHaveProperty('id');
      expect(createdClient).toHaveProperty('id');
      expect(account).toHaveProperty('id');
    });

    it('should not be able to return a nonesxistent account.', async () => {
      const account = await AccountsServices.findAccount('1');
      expect(account).toEqual(Error(errorMessages.accountNotExists));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      const account = await AccountsServices.findAccount('a');
      expect(account).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });

  describe('Add an account', () => {
    it('should be able to add a new account.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const account = await AccountsServices.addAccount('1');

      expect(createdClient).toHaveProperty('id');
      expect(account).toHaveProperty('id');
    });

    it('should not be able to create an account with a nonesxistent client', async () => {
      const account = await AccountsServices.addAccount('1');
      expect(account).toEqual(Error(errorMessages.clientNotExists));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      const account = await AccountsServices.addAccount('a');
      expect(account).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });

  describe('Delete an account', () => {
    it('should be able to delete an account', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount('1');

      const deletedAccount = await AccountsServices.deleteAccount('1');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(deletedAccount).toHaveProperty('id');
    });

    it('should not be able to delete a nonesxistent account.', async () => {
      const account = await AccountsServices.deleteAccount('1');
      expect(account).toEqual(Error(errorMessages.accountNotExists));
    });

    it('should not be able to delete an account with invalid id format.', async () => {
      const account = await AccountsServices.deleteAccount('a');
      expect(account).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });
});
