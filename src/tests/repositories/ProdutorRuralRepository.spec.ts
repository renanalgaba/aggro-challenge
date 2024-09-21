import { ProdutorRuralRepository } from '../../repositories/ProdutorRuralRepository';
import { getDbConnection } from '../../config/database';
import { Repository } from 'typeorm';
import { ProdutorRural } from '../../entities/ProdutorRural';

jest.mock('../../config/database', () => ({
  getDbConnection: jest.fn(),
}));

describe('ProdutorRuralRepository', () => {
  let produtorRuralRepository: ProdutorRuralRepository;
  let mockConnection: any;
  let mockRepository: any;
  let mockQueryBuilder1: any;
  let mockQueryBuilder2: any;
  let mockQueryBuilder3: any;
  let mockQueryBuilder4: any;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockConnection = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    (getDbConnection as jest.Mock).mockReturnValue(mockConnection);

    produtorRuralRepository = new ProdutorRuralRepository();

    mockQueryBuilder1 = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    };

    mockQueryBuilder2 = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    mockQueryBuilder3 = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    mockQueryBuilder4 = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    };

    mockRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValueOnce(mockQueryBuilder1)
      .mockReturnValueOnce(mockQueryBuilder2)
      .mockReturnValueOnce(mockQueryBuilder3)
      .mockReturnValueOnce(mockQueryBuilder4);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve salvar um produtor', async () => {
    const produtorData = { nome: 'João' };
    const createdEntity = { id: 1, nome: 'João' };
    mockRepository.create.mockReturnValue(createdEntity);
    mockRepository.save.mockResolvedValue(createdEntity);

    const result = await produtorRuralRepository.save(produtorData);

    expect(mockRepository.create).toHaveBeenCalledWith(produtorData);
    expect(mockRepository.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toEqual(createdEntity);
  });

  it('deve atualizar um produtor e retornar a entidade atualizada', async () => {
    const id = 1;
    const updateData = { nome: 'Maria' };
    const updatedEntity = { id: 1, nome: 'Maria' };

    mockRepository.update.mockResolvedValue(undefined);
    mockRepository.findOne.mockResolvedValue(updatedEntity);

    const result = await produtorRuralRepository.update(id, updateData);

    expect(mockRepository.update).toHaveBeenCalledWith(id, updateData);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(updatedEntity);
  });

  it('deve deletar um produtor', async () => {
    const id = 1;

    mockRepository.delete.mockResolvedValue(undefined);

    await produtorRuralRepository.delete(id);

    expect(mockRepository.delete).toHaveBeenCalledWith(id);
  });

  it('deve retornar os dados do dashboard', async () => {
    const totalDataResult = { totalFazendas: '5', areaTotal: '1000' };
    const estadosPorFazendaResult = [
      { estado: 'SP', total: '3' },
      { estado: 'MG', total: '2' },
    ];
    const culturasPorFazendaResult = [
      { cultura: 'Soja', total: '4' },
      { cultura: 'Milho', total: '2' },
    ];
    const usoDeSoloResult = {
      areaAgricultavel: '700',
      areaVegetacao: '300',
    };

    mockQueryBuilder1.getRawOne.mockResolvedValue(totalDataResult);
    mockQueryBuilder2.getRawMany.mockResolvedValue(estadosPorFazendaResult);
    mockQueryBuilder3.getRawMany.mockResolvedValue(culturasPorFazendaResult);
    mockQueryBuilder4.getRawOne.mockResolvedValue(usoDeSoloResult);

    const result = await produtorRuralRepository.getDashboardData();

    expect(result).toEqual({
      totalFazendas: totalDataResult.totalFazendas,
      areaTotal: totalDataResult.areaTotal,
      estadosPorFazenda: estadosPorFazendaResult,
      culturasPorFazenda: culturasPorFazendaResult,
      usoDeSolo: usoDeSoloResult,
    });

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(4);

    expect(mockQueryBuilder1.select).toHaveBeenCalledWith(
      'COUNT(produtor.id)',
      'totalFazendas'
    );
    expect(mockQueryBuilder1.addSelect).toHaveBeenCalledWith(
      'SUM(produtor.areaTotal)',
      'areaTotal'
    );
    expect(mockQueryBuilder1.getRawOne).toHaveBeenCalled();

    expect(mockQueryBuilder2.select).toHaveBeenCalledWith(
      'produtor.estado',
      'estado'
    );
    expect(mockQueryBuilder2.addSelect).toHaveBeenCalledWith(
      'COUNT(produtor.id)',
      'total'
    );
    expect(mockQueryBuilder2.groupBy).toHaveBeenCalledWith('produtor.estado');
    expect(mockQueryBuilder2.getRawMany).toHaveBeenCalled();

    expect(mockQueryBuilder3.select).toHaveBeenCalledWith(
      "unnest(string_to_array(produtor.culturas, ','))",
      'cultura'
    );
    expect(mockQueryBuilder3.addSelect).toHaveBeenCalledWith(
      'COUNT(DISTINCT produtor.id)',
      'total'
    );
    expect(mockQueryBuilder3.groupBy).toHaveBeenCalledWith('cultura');
    expect(mockQueryBuilder3.getRawMany).toHaveBeenCalled();

    expect(mockQueryBuilder4.select).toHaveBeenCalledWith(
      'SUM(produtor.areaAgricultavel)',
      'areaAgricultavel'
    );
    expect(mockQueryBuilder4.addSelect).toHaveBeenCalledWith(
      'SUM(produtor.areaVegetacao)',
      'areaVegetacao'
    );
    expect(mockQueryBuilder4.getRawOne).toHaveBeenCalled();
  });
});
