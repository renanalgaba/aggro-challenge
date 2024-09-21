import { ProdutorRuralController } from '../../controllers/ProdutorRuralController';
import { ProdutorRuralService } from '../../services/ProdutorRuralService';
import { Request, Response } from 'express';

const mockProdutorRuralService = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getDashboardData: jest.fn(),
};

const mockRequest = () => {
  return {
    body: {},
    params: {}
  } as Partial<Request>;
};

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('ProdutorRuralController', () => {
  let produtorRuralController: ProdutorRuralController;

  beforeEach(() => {
    produtorRuralController = new ProdutorRuralController(mockProdutorRuralService as unknown as ProdutorRuralService);
  });

  describe('create', () => {
    it('should return 201 and the created produtor when the creation is successful', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const produtorMock = { nome: 'João' };

      mockProdutorRuralService.create.mockResolvedValue(produtorMock);
      req.body = produtorMock;

      await produtorRuralController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(produtorMock);
    });

    it('should return 400 and an error message when an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockProdutorRuralService.create.mockRejectedValue(new Error('Error creating produtor'));

      await produtorRuralController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating produtor' });
    });
  });

  describe('update', () => {
    it('should return 200 and the updated produtor when the update is successful', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const produtorMock = { nome: 'João' };

      mockProdutorRuralService.update.mockResolvedValue(produtorMock);
      req.params = { id: '1' };
      req.body = produtorMock;

      await produtorRuralController.update(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(produtorMock);
    });

    it('should return 400 and an error message when an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockProdutorRuralService.update.mockRejectedValue(new Error('Error updating produtor'));

      await produtorRuralController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating produtor' });
    });
  });

  describe('delete', () => {
    it('should return 204 when the delete is successful', async () => {
      const req = mockRequest();
      const res = mockResponse();

      req.params = { id: '1' };

      await produtorRuralController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 and an error message when an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockProdutorRuralService.delete.mockRejectedValue(new Error('Error deleting produtor'));

      await produtorRuralController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting produtor' });
    });
  });

  describe('getDashboardData', () => {
    it('should return 200 and the dashboard data when successful', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const dashboardData = { totalFazendas: 10, areaTotal: 100 };

      mockProdutorRuralService.getDashboardData.mockResolvedValue(dashboardData);

      await produtorRuralController.getDashboardData(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(dashboardData);
    });

    it('should return 500 and an error message when an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockProdutorRuralService.getDashboardData.mockRejectedValue(new Error('Error fetching dashboard data'));

      await produtorRuralController.getDashboardData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching dashboard data' });
    });
  });
});
