import app from '../server';
import request from 'supertest';
import { Infos } from '../services/transactions';

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

  const transactionData = (account: number | string) => {
    return {
      account,
      type: 'deposit',
      value: 200,
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
      await request(app).post('/transactions').send(transactionData(account)).expect(200);
      await request(app).get('/transactions/1').expect(200);
    });

    it('should not be able to return a nonesxistent transaction.', async () => {
      await request(app)
        .get('/transactions/1')
        .expect(404)
        .then((res) => expect(res.body).toBe("Transaction doesn't exists."));
    });

    it('should not be able to return an transaction with invalid id format.', async () => {
      await request(app)
        .get('/transactions/a')
        .expect(404)
        .then((res) => expect(res.body).toBe('Invalid ID format, use a integer number.'));
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
      await request(app).post('/transactions').send(transactionData(account)).expect(200);
    });

    it('should not be able to create a transaction with a nonesxistent account', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData(123))
        .expect(404)
        .then((res) => expect(res.body).toBe("Account doesn't exists."));
    });

    it('should not be able to create a transaction with invalid account number format.', async () => {
      await request(app)
        .post('/transactions')
        .send(transactionData('a'))
        .expect(404)
        .then((res) => expect(res.body).toBe('The account number needs to be an integer number.'));
    });

    it('should not be able to create a transaction with invalid transaction type.', async () => {
      await request(app)
        .post('/transactions')
        .send({
          account: 1,
          type: 'a',
        })
        .expect(404)
        .then((res) => expect(res.body).toBe("The type needs to be 'balance' | 'transfer' | 'withdraw' | 'deposit'"));
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
        .send({
          account,
          type: 'transfer',
        })
        .expect(404)
        .then((res) =>
          expect(res.body).toBe("To make a transfer, the target account number needs to be declared with 'toAccount'."),
        );
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
        .send({
          account,
          type: 'transfer',
          toAccount: 'a',
        })
        .expect(404)
        .then((res) => expect(res.body).toBe('The Target account number needs to be an integer number.'));
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
        .send({
          account,
          type: 'transfer',
          toAccount: 1,
        })
        .expect(404)
        .then((res) => expect(res.body).toBe("Target account doesn't exist."));
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
        .send({
          account,
          type: 'transfer',
          value: 200,
          toAccount: account,
        })
        .expect(404)
        .then((res) => expect(res.body).toBe('Insufficient funds.'));
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
        .send({
          account,
          type: 'withdraw',
          value: 200,
        })
        .expect(404)
        .then((res) => expect(res.body).toBe('Insufficient funds.'));
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
      await request(app).post('/transactions').send(transactionData(account)).expect(200);
      await request(app).delete('/transactions/1').expect(200);
    });

    it('should not be able to delete a nonesxistent transaction.', async () => {
      await request(app)
        .delete('/transactions/1')
        .expect(404)
        .then((res) => expect(res.body).toBe("Transaction doesn't exists."));
    });

    it('should not be able to delete an transaction with invalid id format.', async () => {
      await request(app)
        .delete('/transactions/a')
        .expect(404)
        .then((res) => expect(res.body).toBe('Invalid ID format, use a integer number.'));
    });
  });
});
