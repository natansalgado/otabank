import express from 'express';
import routes from './routes';
import db from './db';

const app = express();

app.use(express.json());
app.use(routes);

try {
  db.sync();
  console.log(`Database connected: ${process.env.DB_NAME}`);
} catch (err) {
  console.log(err);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
