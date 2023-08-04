import app from '../server';
import request from 'supertest';
import { Infos } from '../services/transactions';
import { errorMessages } from '../errorMessages';

describe('Accounts Controllers', () => {
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
      await request(app).get('/transactions').expect(200);
    });
  });

  describe('Find a transaction by id', () => {
    it('should be able to return one transaction.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app).post('/transactions').send(transactionData(account, 'deposit', 200)).expect(200);
      await request(app).get('/transactions/1').expect(200);
    });

    it('should not be able to return a nonesxistent transaction.', async () => {
      await request(app)
        .get('/transactions/1')
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.transactionNotExists));
    });

    it('should not be able to return an transaction with invalid id format.', async () => {
      await request(app)
        .get('/transactions/a')
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.invalidIdFormat));
    });
  });

  describe('Add an transaction', () => {
    it('should be able to add a new transaction.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app).post('/transactions').send(transactionData(account, 'deposit', 200)).expect(200);
    });

    it('should not be able to create a transaction with invalid account number format.', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData('a'))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.invalidAccountNumber));
    });

    it('should not be able to create a transaction with invalid transaction type.', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData(1, 'a'))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.invalidTransactionType));
    });

    it('should not be able to create a transaction with a invalid value.', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData(1, 'withdraw', 'a'))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.valueIsNaN));
    });

    it('should not be able to create a transaction with a negative value.', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData(1, 'withdraw', -100))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.negativeValue));
    });

    it('should not be able to create a transaction with a nonesxistent account', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData(1, 'balance'))
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.accountNotExists));
    });

    it('should not be able to create a transfer transaction without an account target number.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app)
        .post('/transactions')
        .send(transactionData(account, 'transfer'))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.transferRequiresAccountToId));
    });

    it('should not be able to create a transfer transaction with an invalid account target number.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app)
        .post('/transactions')
        .send(transactionData(account, 'transfer', 100, 'a'))
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.invalidTargetAccountNumber));
    });

    it('should not be able to create a transfer transaction with a nonexistent account target number.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app)
        .post('/transactions')
        .send(transactionData(account, 'transfer', 100, 1))
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.targetAccountNotExists));
    });

    it('should not be able to create a transfer transaction with insufficient founds.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app)
        .post('/transactions')
        .send(transactionData(account, 'transfer', 200, account))
        .expect(400)
        .then((res) => expect(res.body).toBe(errorMessages.insufficientFunds));
    });

    it('should not be able to create a withdraw transaction with insufficient founds.', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app)
        .post('/transactions')
        .send(transactionData(account, 'withdraw', 200))
        .expect(400)
        .then((res) => expect(res.body).toBe(errorMessages.insufficientFunds));
    });
  });

  describe('Delete an transaction', () => {
    it('should be able to delete an transaction', async () => {
      let account = 1;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (account = res.body.number));
      await request(app).post('/transactions').send(transactionData(account, 'deposit', 200)).expect(200);
      await request(app).delete('/transactions/1').expect(200);
    });

    it('should not be able to delete a nonesxistent transaction.', async () => {
      await request(app)
        .delete('/transactions/1')
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.transactionNotExists));
    });

    it('should not be able to delete an transaction with invalid id format.', async () => {
      await request(app)
        .delete('/transactions/a')
        .expect(406)
        .then((res) => expect(res.body).toBe(errorMessages.invalidIdFormat));
    });
  });
});
