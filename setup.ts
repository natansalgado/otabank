import Client, { Client as ClientInfos } from './src/models/clients';
import Account, { Account as AccountInfos } from './src/models/accounts';
import Transaction from './src/models/transactions';
import db from './src/db';

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
  await Transaction.drop();
  await Account.drop();
  await Client.destroy({ truncate: true, restartIdentity: true });
});

afterAll(async () => {
  await Client.destroy({ truncate: true, restartIdentity: true });
  await Client.bulkCreate(clientsBackup);
  await Account.sync();
  await Account.bulkCreate(accountsBackup);
  await Transaction.sync();
});
