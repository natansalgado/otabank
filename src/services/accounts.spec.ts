import Accounts from '../models/accounts';
import AccountsServices from './accounts';
import ClientsServices from './clients';

describe('Accounts Services', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  const accountData = {
    clientId: '1',
  };

  describe('Find All the accounts', () => {
    it('should be able to return all the accounts.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);

      const account1 = await AccountsServices.addAccount(accountData.clientId);
      const account2 = await AccountsServices.addAccount(accountData.clientId);

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
      const createdAccount = await AccountsServices.addAccount(accountData.clientId);
      const account = await AccountsServices.findAccount('1');

      expect(createdAccount).toHaveProperty('id');
      expect(createdClient).toHaveProperty('id');

      if (account instanceof Error) return expect(account.message).toBe('All right');

      expect(account.clientId).toBe(Number(accountData.clientId));
    });

    it('should not be able to return a nonesxistent account.', async () => {
      const account = await AccountsServices.findAccount('1');

      expect(account).not.toHaveProperty('id');
      expect(account).toEqual(Error("Account doesn't exists."));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      const account = await AccountsServices.findAccount('a');

      expect(account).not.toHaveProperty('id');
      expect(account).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });

  describe('Add an account', () => {
    it('should be able to add a new account.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const account = await AccountsServices.addAccount(accountData.clientId);

      expect(createdClient).toHaveProperty('id');
      expect(account).toHaveProperty('id');
    });

    it('should not be able to create an account with a nonesxistent client', async () => {
      const account = await AccountsServices.addAccount(accountData.clientId);

      expect(account).not.toHaveProperty('id');
      expect(account).toEqual(Error("Client doesn't exists."));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      const account = await AccountsServices.addAccount('a');

      expect(account).not.toHaveProperty('id');
      expect(account).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });

  describe('Delete an account', () => {
    it('should be able to delete an account', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const createdAccount = await AccountsServices.addAccount(accountData.clientId);

      const deletedAccount = await AccountsServices.deleteAccount('1');

      if (deletedAccount instanceof Error) return expect(createdClient).toHaveProperty('AllRight');

      if (createdAccount instanceof Error) return expect(createdClient).toHaveProperty('AllRight');

      expect(createdClient).toHaveProperty('id');
      expect(createdAccount).toHaveProperty('id');
      expect(deletedAccount.id).toBe(createdAccount.id);
    });

    it('should not be able to delete a nonesxistent account.', async () => {
      const account = await AccountsServices.deleteAccount('1');

      expect(account).toEqual(Error("Account doesn't exists."));
    });

    it('should not be able to delete an account with invalid id format.', async () => {
      const account = await AccountsServices.deleteAccount('a');

      expect(account).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });
});
