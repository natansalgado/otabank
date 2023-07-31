import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../db';

export class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare number: number;
  declare address: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    address: {
      type: new DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(64),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'clients',
    sequelize: db,
  },
);
