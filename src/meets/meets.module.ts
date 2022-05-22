import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { MeetsController } from './meets.controller';
import { MeetsService } from './meets.service';
import { MeetRepository } from './orm/meet.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MeetRepository])],
  controllers: [MeetsController],
  providers: [MeetsService],
})
export class MeetsModule {}
