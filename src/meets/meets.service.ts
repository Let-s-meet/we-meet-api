import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const found = await this.meetRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Meet with ID "${id}" not found`);
    }

    return found;
  }

  async createMeet(meetCreationDto: MeetCreationDto): Promise<Meet> {
    return this.meetRepository.createMeet(meetCreationDto);
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
