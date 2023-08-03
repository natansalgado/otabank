import ClientRepository, { Client } from '../models/clients';
import { errorMessages } from '../errorMessages';
import bcrypt from 'bcrypt';

type ClientInfos = Pick<Client, 'name' | 'email' | 'number' | 'address' | 'password'>;

const findAll = async (): Promise<Client[]> => {
  const repo = await ClientRepository.findAll();
  return repo;
};

const findClient = async (id: string): Promise<Client | Error> => {
  if (!Number.isInteger(Number(id))) return new Error(errorMessages.invalidIdFormat);

  const repo = await ClientRepository.findByPk(id);

  if (!repo) return new Error(errorMessages.clientNotExists);
  return repo;
};

const addClient = async (client: ClientInfos): Promise<Client | Error> => {
  const emailExists = await ClientRepository.findOne({
    where: { email: client.email },
  });

  if (!client.name || !client.email || !client.address || !client.number || !client.password)
    return new Error(errorMessages.clientInvalidCamp);

  if (emailExists) return new Error(errorMessages.emailAlreadyExists);

  const hash = await bcrypt.hash(client.password, 10);
  client.password = hash;

  const repo = await ClientRepository.create(client);

  return repo;
};

const updateClient = async (id: string, client: Partial<ClientInfos>): Promise<Client | Error> => {
  if (!Number.isInteger(Number(id))) return new Error(errorMessages.invalidIdFormat);

  const updateClient: Partial<ClientInfos> = {
    name: client.name !== '' ? client.name : undefined,
    email: client.email !== '' ? client.email : undefined,
    address: client.address !== '' ? client.address : undefined,
    number: client.number ? client.number : undefined,
    password: client.password !== '' ? client.password : undefined,
  };

  const clientExists = await ClientRepository.update(updateClient, {
    where: { id },
  });
  const repo = await ClientRepository.findByPk(id);

  if (!clientExists || !repo) return new Error(errorMessages.clientNotExists);

  return repo;
};

const deleteClient = async (id: string): Promise<Client | Error> => {
  if (!Number.isInteger(Number(id))) return new Error(errorMessages.invalidIdFormat);

  const repo = await ClientRepository.findByPk(id);

  if (!repo) return new Error(errorMessages.clientNotExists);

  await ClientRepository.destroy({ where: { id } });

  return repo;
};

export default {
  findAll,
  findClient,
  addClient,
  updateClient,
  deleteClient,
};
