import { DataSource } from 'typeorm';
import { ProdutorRural } from '../entities/ProdutorRural';

let AppDataSource: DataSource | null = null;

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [ProdutorRural],
    synchronize: true,
  });

  await AppDataSource.initialize();

  return AppDataSource;
}

export function getDbConnection(): DataSource {
  if (!AppDataSource || !AppDataSource.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return AppDataSource;
}
