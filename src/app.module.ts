import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { MeetsModule } from './meets/meets.module';
import { MeetRepository } from './meets/orm/meet.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmExModule.forCustomRepository([MeetRepository]),
    MeetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
