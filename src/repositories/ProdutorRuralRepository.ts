import { Repository } from 'typeorm';
import { ProdutorRural } from '../entities/ProdutorRural';
import { getDbConnection } from '../config/database';

export class ProdutorRuralRepository {
  private repository: Repository<ProdutorRural>;

  constructor() {
    this.repository = getDbConnection().getRepository(ProdutorRural);
  }

  async save(produtor: Partial<ProdutorRural>) {
    const entity = this.repository.create(produtor);
    return await this.repository.save(entity);
  }

  async update(id: number, data: Partial<ProdutorRural>) {
    await this.repository.update(id, data);
    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }

  async getDashboardData() {
    const totalData = await this.repository.createQueryBuilder('produtor')
      .select('COUNT(produtor.id)', 'totalFazendas')
      .addSelect('SUM(produtor.areaTotal)', 'areaTotal')
      .getRawOne();
  
    const estadosPorFazenda = await this.repository.createQueryBuilder('produtor')
      .select('produtor.estado', 'estado')
      .addSelect('COUNT(produtor.id)', 'total')
      .groupBy('produtor.estado')
      .getRawMany();
  
    const culturasPorFazenda = await this.repository.createQueryBuilder('produtor')
      .select('unnest(string_to_array(produtor.culturas, \',\'))', 'cultura')
      .addSelect('COUNT(DISTINCT produtor.id)', 'total')
      .groupBy('cultura')
      .getRawMany();
  
    const usoDeSolo = await this.repository.createQueryBuilder('produtor')
      .select('SUM(produtor.areaAgricultavel)', 'areaAgricultavel')
      .addSelect('SUM(produtor.areaVegetacao)', 'areaVegetacao')
      .getRawOne();
  
    return {
      totalFazendas: totalData.totalFazendas,
      areaTotal: totalData.areaTotal,
      estadosPorFazenda,
      culturasPorFazenda,
      usoDeSolo,
    };
  }  
}
