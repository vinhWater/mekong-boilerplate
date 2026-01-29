import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = path.resolve(process.cwd(), envFile);

console.log('=== TypeORM Config Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Loading env file:', envFile);
console.log('Full env path:', envPath);
console.log('File exists:', require('fs').existsSync(envPath));

config({ path: envPath });
const configService = new ConfigService();

console.log('DB_HOST after loading:', configService.get('DB_HOST'));
console.log('DB_PORT after loading:', configService.get('DB_PORT'));
console.log('============================');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: configService.get('NODE_ENV') === 'production'
    ? ['dist/**/*.entity.js']
    : ['src/**/*.entity.ts'],
  migrations: configService.get('NODE_ENV') === 'production'
    ? ['dist/src/migrations/*.js']
    : ['src/migrations/*.ts'],
  synchronize: false, // disabled - use migrations for all environments
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
