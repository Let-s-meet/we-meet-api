import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MeetCreationDto } from '../dto/meet-creation.dto';
import { MeetPaginatedResultsDto } from '../dto/meet-paginated-results.dto';
import { MeetPaginationDto } from '../dto/meet-pagination.dto';
import { MeetStatus } from '../enum/meet-status.enum';
import { Meet } from './meet.entity';

@CustomRepository(Meet)
export class MeetRepository extends Repository<Meet> {
  private logger = new Logger('MeetRepository');

  /**
   * Fetch Meets from the DB
   * With or without filters & pagination
   *
   * @param filterDto
   * @returns
   */
  async getMeets(
    filterDto: MeetPaginationDto,
  ): Promise<MeetPaginatedResultsDto> {
    const { page, perPage, q, status } = filterDto;
    const skippedItems = (page - 1) * perPage;
    const total = await this.count();

    const query = this.createQueryBuilder('meet')
      .offset(page ? skippedItems : 0)
      .limit(perPage ? perPage : null)
      .orderBy('meet.created', 'DESC');

    if (status) {
      query.andWhere('meet.status = :status', { status: status });
    }

    if (q) {
      query.andWhere('LOWER(meet.name) LIKE :q', {
        q: `%${q.toLowerCase()}%`,
      });
    }

    try {
      const meets = await query.getMany();
      return {
        total,
        page: filterDto.page ? filterDto.page : 1,
        perPage: filterDto.perPage,
        meets: meets,
      };
    } catch (error) {
      this.logger.error(`Failed to get Meets`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create a new Proejct
   *
   * @param meetCreationDto
   * @returns
   */
  async createMeet(meetCreationDto: MeetCreationDto): Promise<Meet> {
    const meet = new Meet();
    const { name, description, start, end, seats } = meetCreationDto;

    meet.name = name;
    meet.description = description;

    // Meet Dates
    meet.start = start;
    meet.end = end;

    // Meet Seats
    meet.seats = seats;
    meet.available_seats = seats;

    meet.status = MeetStatus.ACTIVE;

    try {
      await meet.save();
      this.logger.verbose(`Meet Creation w/ id: ${meet.id}`);
      return meet;
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException();
    }
  }
}
