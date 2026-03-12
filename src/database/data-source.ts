import { config } from 'dotenv';
config();
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
  entities: ['**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*-migration*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
