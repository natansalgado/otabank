import Client, { Client as ClientInfos } from './src/models/clients'; // Importe o modelo do seu cliente aqui

let clientsBackup: ClientInfos[];

beforeAll(async () => {
  await Client.sync();
  const clients = await Client.findAll();
  clientsBackup = clients.map((client) => client.toJSON());
});

beforeEach(async () => {
  await Client.destroy({ truncate: true, restartIdentity: true });
});

afterAll(async () => {
  await Client.destroy({ truncate: true, restartIdentity: true });
  await Client.bulkCreate(clientsBackup);
});
