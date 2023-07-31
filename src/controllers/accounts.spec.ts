import app from '../server';
import request from 'supertest';

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
      await request(app).get('/accounts').expect(200);
    });
  });

  describe('Find an account by id', () => {
    it('should be able to return one account.', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).post('/accounts').send(accountData).expect(200);
      await request(app).get('/accounts/1').expect(200);
    });

    it('should not be able to return a nonesxistent account.', async () => {
      await request(app)
        .get('/accounts/1')
        .expect(404)
        .then((res) => expect(res.body).toBe("Account doesn't exists."));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      await request(app)
        .get('/accounts/a')
        .expect(404)
        .then((res) => expect(res.body).toBe('Invalid ID format, use a integer number.'));
    });
  });

  describe('Add an account', () => {
    it('should be able to add a new account.', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).post('/accounts').send(accountData).expect(200);
    });

    it('should not be able to create an account with a nonesxistent client', async () => {
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(404)
        .then((res) => expect(res.body).toBe("Client doesn't exists."));
    });

    it('should not be able to return an account with invalid id format.', async () => {
      await request(app)
        .post('/accounts')
        .send({ clientId: 'a' })
        .expect(404)
        .then((res) => expect(res.body).toBe('Invalid ID format, use a integer number.'));
    });
  });

  describe('Add a value to Account', () => {
    it('should be able to add a value to an account.', async () => {
      let number;
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(200)
        .then((res) => (number = res.body.number));
      await request(app).patch('/accounts').send({ number, value: 100 }).expect(200);
    });

    it('should not be able to add value to a nonesxistent number account.', async () => {
      await request(app)
        .patch('/accounts')
        .send({ number: 1, value: 100 })
        .expect(404)
        .then((res) => expect(res.body).toBe("Account doesn't exists."));
    });

    it('should not be able to add value to an account with invalid id format.', async () => {
      await request(app)
        .patch('/accounts')
        .send({ number: 'a', value: 100 })
        .expect(404)
        .then((res) => expect(res.body).toBe('The account number need to be a integer number.'));
    });
  });

  describe('Delete an account', () => {
    it('should be able to delete an account', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).post('/accounts').send(accountData).expect(200);
      await request(app).delete('/accounts/1').send(accountData).expect(200);
    });

    it('should not be able to delete a nonesxistent account.', async () => {
      await request(app)
        .delete('/accounts/1')
        .send(accountData)
        .expect(404)
        .then((res) => expect(res.body).toBe("Account doesn't exists."));
    });

    it('should not be able to delete an account with invalid id format.', async () => {
      await request(app)
        .delete('/accounts/a')
        .send(accountData)
        .expect(404)
        .then((res) => expect(res.body).toBe('Invalid ID format, use a integer number.'));
    });
  });
});
