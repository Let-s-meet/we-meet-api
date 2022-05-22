import { Module } from '@nestjs/common';
import { MeetsModule } from './meets/meets.module';

@Module({
  imports: [MeetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
