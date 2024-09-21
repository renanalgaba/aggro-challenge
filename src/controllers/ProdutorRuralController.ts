import { Request, Response } from 'express';
import { ProdutorRuralService } from '../services/ProdutorRuralService'

export class ProdutorRuralController {
  constructor(private produtorRuralService: ProdutorRuralService) {}

  async create(req: Request, res: Response) {
    try {
      const produtor = await this.produtorRuralService.create(req.body);
      res.status(201).json(produtor);
    } catch (error) {
      res.status(400).json({ message: this.getErrorMessage(error) });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const produtor = await this.produtorRuralService.update(Number(req.params.id), req.body);
      res.json(produtor);
    } catch (error) {
      res.status(400).json({ message: this.getErrorMessage(error) });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.produtorRuralService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: this.getErrorMessage(error) });
    }
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const dashboardData = await this.produtorRuralService.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.log('Error', error)
      res.status(500).json({ message: this.getErrorMessage(error) });
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}