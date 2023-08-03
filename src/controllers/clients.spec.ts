import { errorMessages } from '../errorMessages';
import app from '../server';
import request from 'supertest';

describe('Clients Controller', () => {
  const clientData = {
    name: 'Test Name',
    password: 'TestPassword123',
    email: 'test@test.com',
    number: 912345678,
    address: 'Test Street, 123',
  };

  describe('Find All the clients', () => {
    it('should be able to return all the clients.', async () => {
      await request(app).get('/clients').expect(200);
    });
  });

  describe('Find client by id', () => {
    it('should be able to return one client.', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).get('/clients/1').expect(200);
    });

    it('should not be able to return a nonesxistent client.', async () => {
      await request(app)
        .get('/clients/1')
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.clientNotExists));
    });

    it('should not be able to return a client with invalid id format.', async () => {
      await request(app)
        .get('/clients/a')
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.invalidIdFormat));
    });
  });

  describe('Add a client', () => {
    it('should be able to add a new client.', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
    });

    it('should not be able to create an existing client.', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app)
        .post('/clients')
        .send(clientData)
        .expect(400)
        .then((res) => expect(res.body).toBe(errorMessages.emailAlreadyExists));
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

      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).patch('/clients/1').send(updateData).expect(200);
    });

    it('should not be able to update a nonesxistent client infos.', async () => {
      await request(app)
        .patch('/clients/1')
        .send({})
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.clientNotExists));
    });

    it('should not be able to update a client with invalid id format.', async () => {
      await request(app)
        .patch('/clients/a')
        .send({})
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.invalidIdFormat));
    });
  });

  describe('Delete a client', () => {
    it('should be able to delete a client', async () => {
      await request(app).post('/clients').send(clientData).expect(200);
      await request(app).delete('/clients/1').send(clientData).expect(200);
    });

    it('should not be able to delete a nonesxistent client.', async () => {
      await request(app)
        .delete('/clients/1')
        .send(clientData)
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.clientNotExists));
    });

    it('should not be able to update a client with invalid id format.', async () => {
      await request(app)
        .delete('/clients/a')
        .send(clientData)
        .expect(404)
        .then((res) => expect(res.body).toBe(errorMessages.invalidIdFormat));
    });
  });
});
