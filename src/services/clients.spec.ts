import { Client } from '../models/clients';
import ClientsServices from './clients';
import { errorMessages } from '../errorMessages';

describe('Clients Services', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  describe('Find All the clients', () => {
    it('should be able to return all the clients.', async () => {
      const client1Data = { ...clientData, email: 'test1@$test.com' };
      const client2Data = { ...clientData, email: 'test2@$test.com' };

      const client1 = await ClientsServices.addClient(client1Data);
      const client2 = await ClientsServices.addClient(client2Data);

      const clients = await ClientsServices.findAll();

      expect(client1).toHaveProperty('id');
      expect(client2).toHaveProperty('id');
      expect(clients).toHaveLength(2);
    });
  });

  describe('Find client by id', () => {
    it('should be able to return one client.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const client = await ClientsServices.findClient('1');

      expect(createdClient).toHaveProperty('id');
      expect(client).toHaveProperty('id');
    });

    it('should not be able to return a nonesxistent client.', async () => {
      const client = await ClientsServices.findClient('1');
      expect(client).toEqual(Error(errorMessages.clientNotExists));
    });

    it('should not be able to return a client with invalid id format.', async () => {
      const client = await ClientsServices.findClient('a');
      expect(client).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });

  describe('Add a client', () => {
    it('should be able to add a new client.', async () => {
      const client = await ClientsServices.addClient(clientData);
      expect(client).toHaveProperty('id');
    });

    it('should not be able to create a client with an invalid camp.', async () => {
      const noNameClientData = { ...clientData, name: '' };
      const noNameClient = await ClientsServices.addClient(noNameClientData);

      const noEmailClientData = { ...clientData, email: '' };
      const noEmailClient = await ClientsServices.addClient(noEmailClientData);

      const noAddressClientData = { ...clientData, address: '' };
      const noAddressClient = await ClientsServices.addClient(noAddressClientData);

      const noNumberClientData = { ...clientData, number: 0 };
      const noNumberClient = await ClientsServices.addClient(noNumberClientData);

      const noPasswordClientData = { ...clientData, password: '' };
      const noPasswordClient = await ClientsServices.addClient(noPasswordClientData);

      expect(noNameClient).toEqual(Error(errorMessages.clientInvalidCamp));
      expect(noEmailClient).toEqual(Error(errorMessages.clientInvalidCamp));
      expect(noAddressClient).toEqual(Error(errorMessages.clientInvalidCamp));
      expect(noNumberClient).toEqual(Error(errorMessages.clientInvalidCamp));
      expect(noAddressClient).toEqual(Error(errorMessages.clientInvalidCamp));
      expect(noPasswordClient).toEqual(Error(errorMessages.clientInvalidCamp));
    });

    it('should not be able to create an existing client.', async () => {
      const firstClient = await ClientsServices.addClient(clientData);
      const repeatClient = await ClientsServices.addClient(clientData);
      
      expect(firstClient).toHaveProperty('id');
      expect(repeatClient).toEqual(Error(errorMessages.emailAlreadyExists));
    });
  });

  describe('Update a client', () => {
    it('should be able to update a client infos.', async () => {
      const updateData = {
        name: 'Name Updated',
        password: 'Password Updated',
        email: '',
        address: 'Updated Address, 134',
      };

      const createdClient = await ClientsServices.addClient(clientData);
      const updatedClient = await ClientsServices.updateClient('1', updateData);

      expect(createdClient).toHaveProperty('id');
      expect(updatedClient).toHaveProperty('id');
      expect((updatedClient as Client).name).toBe(updateData.name);
      expect((updatedClient as Client).password).toBe(updateData.password);
      expect((updatedClient as Client).email).toBe(clientData.email);
      expect((updatedClient as Client).number).toBe(clientData.number);
      expect((updatedClient as Client).address).toBe(updateData.address);
    });

    it('should not be able to update a nonesxistent client infos.', async () => {
      const client = await ClientsServices.updateClient('1', {});
      expect(client).toEqual(Error(errorMessages.clientNotExists));
    });

    it('should not be able to update a client with invalid id format.', async () => {
      const client = await ClientsServices.updateClient('a', {});
      expect(client).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });

  describe('Delete a client', () => {
    it('should be able to delete a client', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const deletedClient = await ClientsServices.deleteClient('1');
      expect(createdClient).toHaveProperty('id');
      expect(deletedClient).toHaveProperty('id');
    });

    it('should not be able to delete a nonesxistent client.', async () => {
      const client = await ClientsServices.deleteClient('1');
      expect(client).toEqual(Error(errorMessages.clientNotExists));
    });

    it('should not be able to delete a client with invalid id format.', async () => {
      const client = await ClientsServices.deleteClient('a');
      expect(client).toEqual(Error(errorMessages.invalidIdFormat));
    });
  });
});
