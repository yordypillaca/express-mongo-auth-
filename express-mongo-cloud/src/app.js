import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const down =
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongooseError' ||
    err.message?.includes('not connected');
  res.status(down ? 503 : 500).json({
    message: down ? 'Database unavailable' : 'Internal server error'
  });
});

export default app;
