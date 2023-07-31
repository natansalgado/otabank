import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Deferrable } from 'sequelize';
import db from '../db';
import Client from './clients';

export class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare number: number;
  declare clientId: number;
  declare balance: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: 'id',
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      onDelete: 'cascade',
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },

  {
    tableName: 'accounts',
    sequelize: db,
  },
);
