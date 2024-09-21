import { ProdutorRuralRepository } from '../repositories/ProdutorRuralRepository';
import { ProdutorRural } from '../entities/ProdutorRural';
import { validateCPFCNPJ, validateAreas } from '../utils/validations';

export class ProdutorRuralService {
  private produtorRuralRepository: ProdutorRuralRepository;

  constructor(produtorRuralRepository: ProdutorRuralRepository) {
    this.produtorRuralRepository = produtorRuralRepository;
  }

  async create(data: Partial<ProdutorRural>) {
    if (!data.documento) {
      throw new Error('Documento é obrigatório');
    }

    if (!validateCPFCNPJ(data.documento)) {
      throw new Error('CPF ou CNPJ inválido');
    }

    if (
      data.areaTotal === undefined ||
      data.areaAgricultavel === undefined ||
      data.areaVegetacao === undefined
    ) {
      throw new Error('Todas as áreas são obrigatórias');
    }

    if (!validateAreas(data.areaTotal, data.areaAgricultavel, data.areaVegetacao)) {
      throw new Error('Áreas inválidas');
    }

    return await this.produtorRuralRepository.save(data);
  }

  async update(id: number, data: Partial<ProdutorRural>) {
    if (data.documento && !validateCPFCNPJ(data.documento)) {
      throw new Error('CPF ou CNPJ inválido');
    }

    if (
      data.areaTotal !== undefined &&
      data.areaAgricultavel !== undefined &&
      data.areaVegetacao !== undefined &&
      !validateAreas(data.areaTotal, data.areaAgricultavel, data.areaVegetacao)
    ) {
      throw new Error('Áreas inválidas');
    }

    return await this.produtorRuralRepository.update(id, data);
  }

  async delete(id: number) {
    await this.produtorRuralRepository.delete(id);
  }

  async getDashboardData() {
    const dashboardData = await this.produtorRuralRepository.getDashboardData();
    return dashboardData;
  }
}
