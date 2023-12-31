import ClientRepository, { Client } from '../models/clients';
import { errorMessages } from '../errorMessages';
import AppError from '../appError';
import bcrypt from 'bcrypt';

type ClientInfos = Pick<Client, 'name' | 'email' | 'number' | 'address' | 'password'>;

const findAll = async (): Promise<Client[]> => {
  const repo = await ClientRepository.findAll();
  return repo;
};

const findClient = async (id: string): Promise<Client | AppError> => {
  if (!Number.isInteger(Number(id))) return new AppError(404, errorMessages.invalidIdFormat);

  const repo = await ClientRepository.findByPk(id);

  if (!repo) return new AppError(404, errorMessages.clientNotExists);
  return repo;
};

const addClient = async (client: ClientInfos): Promise<Client | Error> => {
  const emailExists = await ClientRepository.findOne({
    where: { email: client.email },
  });

  if (!client.name || !client.email || !client.address || !client.number || !client.password)
    return new AppError(406, errorMessages.clientInvalidCamp);

  if (emailExists) return new AppError(409, errorMessages.emailAlreadyExists);

  const hash = await bcrypt.hash(client.password, 10);
  client.password = hash;

  const repo = await ClientRepository.create(client);

  return repo;
};

const updateClient = async (id: string, client: Partial<ClientInfos>): Promise<Client | Error> => {
  if (!Number.isInteger(Number(id))) return new AppError(406, errorMessages.invalidIdFormat);

  const updateClient: Partial<ClientInfos> = {
    name: client.name !== '' ? client.name : undefined,
    email: client.email !== '' ? client.email : undefined,
    address: client.address !== '' ? client.address : undefined,
    number: client.number ? client.number : undefined,
    password: client.password !== '' ? client.password : undefined,
  };

  await ClientRepository.update(updateClient, { where: { id } });
  const repo = await ClientRepository.findByPk(id);

  if (!repo) return new AppError(404, errorMessages.clientNotExists);

  return repo;
};

const deleteClient = async (id: string): Promise<Client | Error> => {
  if (!Number.isInteger(Number(id))) return new AppError(406, errorMessages.invalidIdFormat);

  const repo = await ClientRepository.findByPk(id);

  if (!repo) return new AppError(404, errorMessages.clientNotExists);

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
