import Client, { Client as ClientInfos } from './src/models/clients';
import Account, { Account as AccountInfos } from './src/models/accounts';
import Transaction, { Transaction as TransactionsInfos } from './src/models/transactions';
import db from './src/db';
import { server } from './src/server';

let clientsBackup: ClientInfos[];
let accountsBackup: AccountInfos[];
let transactionsBackup: TransactionsInfos[];

beforeAll(async () => {
  await db.sync().then(async () => {
    const transactions = await Transaction.findAll();
    const accounts = await Account.findAll();
    const clients = await Client.findAll();
    transactionsBackup = transactions.map((transaction) => transaction.toJSON());
    accountsBackup = accounts.map((account) => account.toJSON());
    clientsBackup = clients.map((client) => client.toJSON());
  });
});

beforeEach(async () => {
  await db.drop().then(async () => await db.sync());
});

afterAll(async () => {
  await db
    .drop()
    .then(async () => await db.sync())
    .then(async () => {
      await Client.bulkCreate(clientsBackup);
      await Account.bulkCreate(accountsBackup);
      await Transaction.bulkCreate(transactionsBackup);
    });
  server.close();
});
