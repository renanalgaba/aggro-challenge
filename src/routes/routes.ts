import { Router } from 'express';
import { ProdutorRuralController } from '../controllers/ProdutorRuralController';
import { ProdutorRuralService } from '../services/ProdutorRuralService';
import { ProdutorRuralRepository } from '../repositories/ProdutorRuralRepository';
import { initializeDatabase } from '../config/database';

const router = Router();

let produtorRuralController: ProdutorRuralController;

export async function initializeRoutes(): Promise<Router> {
  await initializeDatabase();

  const produtorRuralRepository = new ProdutorRuralRepository();

  const produtorRuralService = new ProdutorRuralService(produtorRuralRepository);

  produtorRuralController = new ProdutorRuralController(produtorRuralService);

  router.post('/produtores', produtorRuralController.create.bind(produtorRuralController));
  router.put('/produtores/:id', produtorRuralController.update.bind(produtorRuralController));
  router.delete('/produtores/:id', produtorRuralController.delete.bind(produtorRuralController));
  router.get('/dashboard', produtorRuralController.getDashboardData.bind(produtorRuralController));

  return router;
}
