import { Logger } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Meet } from './meet.entity';

@CustomRepository(Meet)
export class MeetRepository extends Repository<Meet> {
  private logger = new Logger('MeetRepository');
}
