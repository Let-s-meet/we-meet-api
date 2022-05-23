import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/orm/user.entity';
import { MeetCreationDto } from './dto/meet-creation.dto';
import { MeetPaginatedResultsDto } from './dto/meet-paginated-results.dto';
import { MeetPaginationDto } from './dto/meet-pagination.dto';
import { MeetStatus } from './enum/meet-status.enum';
import { Meet } from './orm/meet.entity';
import { MeetRepository } from './orm/meet.repository';

@Injectable()
export class MeetsService {
  constructor(
    @InjectRepository(MeetRepository)
    private readonly meetRepository: MeetRepository,
  ) {}

  private logger = new Logger('MeetService');

  async getMeets(
    filterDto: MeetPaginationDto,
  ): Promise<MeetPaginatedResultsDto> {
    return this.meetRepository.getMeets(filterDto);
  }

  async getMeetById(id: string): Promise<Meet> {
    return this.meetRepository.getMeetById(id);
  }

  async joinMeet(id: string, user: User) {
    return this.meetRepository.joinMeet(id, user);
  }

  async leaveMeet(id: string, user: User) {
    return this.meetRepository.leaveMeet(id, user);
  }

  async createMeet(
    meetCreationDto: MeetCreationDto,
    user: User,
  ): Promise<Meet> {
    return this.meetRepository.createMeet(meetCreationDto, user);
  }

  async updateMeetStatus(id: string, status: MeetStatus): Promise<Meet> {
    const meet = await this.getMeetById(id);
    meet.status = status;

    try {
      await meet.save();
      this.logger.verbose(`Meet with id "${id}" successfully updated`);
    } catch (error) {
      console.log(error);
    }
    return meet;
  }
}
