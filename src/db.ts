import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize({
  username: dbUser,
  password: dbPassword,
  database: dbName,
  host: dbHost,
  dialect: 'postgres',
  logging: false
});

export default sequelize;
