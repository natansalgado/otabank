import express from 'express';
import ClientsRoutes from './routes/clients';
import AccountsRoutes from './routes/accounts';
import db from './db';

const app = express();

app.use(express.json());

app.use('/clients', ClientsRoutes);
app.use('/accounts', AccountsRoutes);

try {
  db.sync();
  console.log(`--------------------------------
- Database connected: ${process.env.DB_NAME} -`);
} catch (err) {
  console.log(err);
}

const PORT = process.env.PORT || 3000;
export const server = app.listen(PORT, () => {
  console.log(`- Server running on port ${PORT}. -
--------------------------------`);
});

export default app;
