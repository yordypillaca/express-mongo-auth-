import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// Solo en Windows: algunos resolvers fallan en querySrv con mongodb+srv. En Linux (Render) usar DNS por defecto.
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Sin esto, si Mongo no conecta, Mongoose encola consultas y acaba en timeout/crash (buffering).
mongoose.set('bufferCommands', false);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// Render exige abrir el puerto HTTP pronto; Mongo va después.
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('HTTP server error:', err);
});

if (!MONGO_URI) {
  console.error('Missing MONGO_URI — set it in Render Environment Variables');
} else {
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

