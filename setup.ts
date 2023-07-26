import Client, { Client as ClientInfos } from './src/models/clients'; // Importe o modelo do seu cliente aqui
import db from './src/db';
import Account, { Account as AccountInfos } from './src/models/accounts';

let clientsBackup: ClientInfos[];
let accountsBackup: AccountInfos[];

beforeAll(async () => {
  await db.sync();
  const accounts = await Account.findAll();
  const clients = await Client.findAll();
  accountsBackup = accounts.map((account) => account.toJSON());
  clientsBackup = clients.map((client) => client.toJSON());
});

beforeEach(async () => {
  await Account.drop();
  await Client.destroy({ truncate: true, restartIdentity: true });
});

afterAll(async () => {
  await Client.destroy({ truncate: true, restartIdentity: true });
  await Client.bulkCreate(clientsBackup);
  await Account.sync();
  await Account.bulkCreate(accountsBackup);
});
