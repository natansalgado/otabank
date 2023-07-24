import ClientServices from '../services/clients';
import sequelize from '../db';
import { Client } from '../models/clients';

describe('Client Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a new client', async () => {
    const clientData = {
      name: 'Client Test',
      password: 'passwordTest',
      email: 'test@email.com',
      number: 1122334455,
      address: 'Test, 2345',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createClientMock = jest
      .spyOn(Client, 'create')
      .mockImplementation((clientData) => {
        return {
          id: 1,
          ...clientData,
        } as Client;
      });

    const client = await ClientServices.addClient(clientData);

    expect(createClientMock).toHaveBeenCalledWith(clientData);

    if (client instanceof Error) {
      expect(client.message).toBe('Client created.');
    } else {
      expect(client).toBeDefined();
      expect(client.name).toBe(clientData.name);
      expect(client.email).toBe(clientData.email);
      expect(client.password).toBe(clientData.password);
      expect(client.number).toBe(clientData.number);
      expect(client.address).toBe(clientData.address);
      expect(client.createdAt).toBe(clientData.createdAt);
      expect(client.updatedAt).toBe(clientData.updatedAt);
      expect(client.id).toBe(1)
    }
    //createClientMock.mockRestore();
  });
});
