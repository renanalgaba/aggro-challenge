import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { initializeRoutes } from './routes/routes';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  try {
    const router = await initializeRoutes();
    app.use(router);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();