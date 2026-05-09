import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// Node en Windows a veces usa un resolver que devuelve ECONNREFUSED en querySrv (mongodb+srv).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Render (y similares) exigen que el servidor abra el puerto HTTP pronto. Si solo
// haces listen() después de Mongo, un connect lento o colgado provoca "Application exited early".
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

