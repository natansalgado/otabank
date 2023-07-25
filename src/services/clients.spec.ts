import ClientsServices from './clients';

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
      const clientsData = [
        {
          name: 'Test Name 1',
          password: 'TestPassword1',
          email: 'test1@$test2.com',
          number: 912345678,
          address: 'Test Street, 1',
        },
        {
          name: 'Test Name 2',
          password: 'TestPassword2',
          email: 'test2@$test2.com',
          number: 912345678,
          address: 'Test Street, 2',
        },
      ];

      const client1 = await ClientsServices.addClient(clientsData[0]);
      const client2 = await ClientsServices.addClient(clientsData[1]);

      const clients = await ClientsServices.findAll();

      expect(client1).toHaveProperty('id');
      expect(client2).toHaveProperty('id');
      expect(clients).toHaveLength(clientsData.length);
    });
  });

  describe('Find client by id', () => {
    it('should be able to return one client.', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const client = await ClientsServices.findClient('1');

      expect(createdClient).toHaveProperty('id');
      expect(client.name).toBe(clientData.name);
    });

    it('should not be able to return a nonesxistent client.', async () => {
      const client = await ClientsServices.findClient('1');

      expect(client).toEqual(Error("Client doesn't exists."));
    });

    it('should not be able to return a client with invalid id format.', async () => {
      const client = await ClientsServices.findClient('a');

      expect(client).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });

  describe('Add a client', () => {
    it('should be able to add a new client.', async () => {
      const client = await ClientsServices.addClient(clientData);
      expect(client).toHaveProperty('id');
    });

    it('should not be able to create an existing client.', async () => {
      const firstClient = await ClientsServices.addClient(clientData);
      const repeatClient = await ClientsServices.addClient(clientData);

      expect(firstClient).toHaveProperty('id');
      expect(repeatClient).toEqual(Error('Email already exists.'));
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

      if (updatedClient instanceof Error)
        return expect(createdClient).toHaveProperty('AllRight');

      expect(createdClient).toHaveProperty('id');
      expect(updatedClient).toHaveProperty('id');
      expect(updatedClient.name).toBe(updateData.name);
      expect(updatedClient.password).toBe(updateData.password);
      expect(updatedClient.email).toBe(clientData.email);
      expect(updatedClient.number).toBe(clientData.number);
      expect(updatedClient.address).toBe(updateData.address);
    });

    it('should not be able to update a nonesxistent client infos.', async () => {
      const client = await ClientsServices.updateClient('1', {});

      expect(client).toEqual(Error("Client doesn't exists."));
    });

    it('should not be able to update a client with invalid id format.', async () => {
      const client = await ClientsServices.updateClient('a', {});

      expect(client).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });

  describe('Delete a client', () => {
    it('should be able to delete a client', async () => {
      const createdClient = await ClientsServices.addClient(clientData);
      const deletedClient = await ClientsServices.deleteClient('1');

      if (deletedClient instanceof Error)
        return expect(createdClient).toHaveProperty('AllRight');

      expect(createdClient).toHaveProperty('id');
      expect(deletedClient).toHaveProperty('id');
      expect(deletedClient.name).toBe(clientData.name);
      expect(deletedClient.password).toBe(clientData.password);
      expect(deletedClient.email).toBe(clientData.email);
      expect(deletedClient.number).toBe(clientData.number);
      expect(deletedClient.address).toBe(clientData.address);
    });

    it('should not be able to delete a nonesxistent client infos.', async () => {
      const client = await ClientsServices.deleteClient('1');

      expect(client).toEqual(Error("Client doesn't exists."));
    });

    it('should not be able to update a client with invalid id format.', async () => {
      const client = await ClientsServices.deleteClient('a');

      expect(client).toEqual(Error('Invalid ID format, use a integer number.'));
    });
  });
});
