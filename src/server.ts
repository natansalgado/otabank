import express, { Request, Response } from 'express';
import ClientsRoutes from './routes/clients';
import db from './db';

const app = express();

app.use(express.json());

app.use('/clients', ClientsRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello world!' });
});

try {
  db.sync();
  console.log(`Database connected: ${process.env.DB_NAME}`);
} catch (err) {
  console.log(err);
}

const PORT = process.env.PORT || 3000;
export const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

export default app;
