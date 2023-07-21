import { Request, Response } from 'express';
import ClientRepository from '../models/clientsModel';

const findAll = (req: Request, res: Response) => {
  ClientRepository.findAll().then((result) => res.json(result));
};

const findClient = (req: Request, res: Response) => {
  ClientRepository.findByPk(req.params.id).then((result) => res.json(result));
};

const addClient = (req: Request, res: Response) => {
  ClientRepository.create({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    address: req.body.address,
    password: req.body.password,
  }).then((result) => res.json(result));
};

const updateClient = (req: Request, res: Response) => {
  ClientRepository.update(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,
      address: req.body.address,
    },
    { where: { id: req.params.id } },
  );

  ClientRepository.findByPk(req.params.id).then((result) => res.json(result));
};

const deleteClient = (req: Request, res: Response) => {
  ClientRepository.destroy({
    where: {
      id: req.params.id,
    },
  });

  ClientRepository.findAll().then((result) => res.json(result));
};

export default { findAll, findClient, addClient, updateClient, deleteClient };
