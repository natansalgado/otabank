import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Deferrable } from 'sequelize';
import db from '../db';
import Account from './accounts';

export class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
  declare id: CreationOptional<number>;
  declare accountId: number;
  declare accountToId?: CreationOptional<number>;
  declare type: string;
  declare value: number;
  declare createdAt: CreationOptional<Date>;
}

export default Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: 'id',
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      onDelete: 'cascade',
    },
    accountToId: {
      type: DataTypes.INTEGER,
      allowNull: true,

      references: {
        model: Account,
        key: 'id',
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      onDelete: 'cascade',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    createdAt: DataTypes.DATE,
  },
  {
    tableName: 'transactions',
    sequelize: db,
  },
);
