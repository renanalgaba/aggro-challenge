import { ProdutorRuralService } from '../../services/ProdutorRuralService';
import { ProdutorRuralRepository } from '../../repositories/ProdutorRuralRepository';
import { validateCPFCNPJ, validateAreas } from '../../utils/validations';

const mockProdutorRuralRepository = {
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getDashboardData: jest.fn(),
};

jest.mock('../../utils/validations', () => ({
  validateCPFCNPJ: jest.fn(),
  validateAreas: jest.fn(),
}));

describe('ProdutorRuralService', () => {
  let produtorRuralService: ProdutorRuralService;

  beforeEach(() => {
    produtorRuralService = new ProdutorRuralService(mockProdutorRuralRepository as unknown as ProdutorRuralRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('create', () => {
    it('should successfully create a produtor when data is valid', async () => {
      const produtorData = { documento: '12345678901', areaTotal: 100, areaAgricultavel: 50, areaVegetacao: 30 };

      (validateCPFCNPJ as jest.Mock).mockReturnValue(true);
      (validateAreas as jest.Mock).mockReturnValue(true);

      mockProdutorRuralRepository.save.mockResolvedValue(produtorData);

      const result = await produtorRuralService.create(produtorData);

      expect(validateCPFCNPJ).toHaveBeenCalledWith(produtorData.documento);
      expect(validateAreas).toHaveBeenCalledWith(produtorData.areaTotal, produtorData.areaAgricultavel, produtorData.areaVegetacao);
      expect(mockProdutorRuralRepository.save).toHaveBeenCalledWith(produtorData);
      expect(result).toEqual(produtorData);
    });

    it('should throw an error if CPF or CNPJ is invalid', async () => {
      const produtorData = { documento: '123', areaTotal: 100, areaAgricultavel: 50, areaVegetacao: 30 };

      (validateCPFCNPJ as jest.Mock).mockReturnValue(false);

      await expect(produtorRuralService.create(produtorData)).rejects.toThrow('CPF ou CNPJ inválido');
      expect(validateCPFCNPJ).toHaveBeenCalledWith(produtorData.documento);
      expect(mockProdutorRuralRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if areas are invalid', async () => {
      const produtorData = { documento: '12345678901', areaTotal: 100, areaAgricultavel: 110, areaVegetacao: 30 };

      (validateCPFCNPJ as jest.Mock).mockReturnValue(true);
      (validateAreas as jest.Mock).mockReturnValue(false);

      await expect(produtorRuralService.create(produtorData)).rejects.toThrow('Áreas inválidas');
      expect(validateAreas).toHaveBeenCalledWith(produtorData.areaTotal, produtorData.areaAgricultavel, produtorData.areaVegetacao);
      expect(mockProdutorRuralRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a produtor when data is valid', async () => {
      const produtorData = { documento: '12345678901', areaTotal: 100, areaAgricultavel: 50, areaVegetacao: 30 };

      (validateCPFCNPJ as jest.Mock).mockReturnValue(true);
      (validateAreas as jest.Mock).mockReturnValue(true);

      mockProdutorRuralRepository.update.mockResolvedValue(produtorData);

      const result = await produtorRuralService.update(1, produtorData);

      expect(validateCPFCNPJ).toHaveBeenCalledWith(produtorData.documento);
      expect(validateAreas).toHaveBeenCalledWith(produtorData.areaTotal, produtorData.areaAgricultavel, produtorData.areaVegetacao);
      expect(mockProdutorRuralRepository.update).toHaveBeenCalledWith(1, produtorData);
      expect(result).toEqual(produtorData);
    });

    it('should throw an error if CPF or CNPJ is invalid during update', async () => {
      const produtorData = { documento: '123', areaTotal: 100, areaAgricultavel: 50, areaVegetacao: 30 };

      (validateCPFCNPJ as jest.Mock).mockReturnValue(false);

      await expect(produtorRuralService.update(1, produtorData)).rejects.toThrow('CPF ou CNPJ inválido');
      expect(validateCPFCNPJ).toHaveBeenCalledWith(produtorData.documento);
      expect(mockProdutorRuralRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a produtor by ID', async () => {
      const produtorId = 1;
      mockProdutorRuralRepository.delete.mockResolvedValue(undefined);

      await produtorRuralService.delete(produtorId);

      expect(mockProdutorRuralRepository.delete).toHaveBeenCalledWith(produtorId);
    });
  });

  describe('getDashboardData', () => {
    it('should return dashboard data', async () => {
      const dashboardData = { totalFazendas: 10, areaTotal: 1000 };

      mockProdutorRuralRepository.getDashboardData.mockResolvedValue(dashboardData);

      const result = await produtorRuralService.getDashboardData();

      expect(result).toEqual(dashboardData);
      expect(mockProdutorRuralRepository.getDashboardData).toHaveBeenCalled();
    });
  });
});
