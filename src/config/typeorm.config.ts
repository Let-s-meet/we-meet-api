import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST') || 'localhost',
      port: configService.get('DATABASE_PORT') || 5432,
      username: configService.get('DATABASE_USERNAME') || 'postgres',
      password: configService.get('DATABASE_PASSWORD') || 'kamoulox',
      database: configService.get('DATABASE_NAME') || 'wemeet',
      entities: [__dirname + '/../../dist/**/*entity.js'],
      subscribers: [__dirname + '/../../dist/**/*subscriber.js'],
      synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE') || true,
      logging: configService.get<LoggerOptions>('TYPEORM_LOGGING') || false,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
