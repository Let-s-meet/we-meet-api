import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { User } from 'src/users/orm/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
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
      .leftJoin('meet.attendees', 'attendee')
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

  async getMeetById(id: string) {
    const query = this.createQueryBuilder('meet')
      .leftJoin('meet.attendees', 'attendee')
      .select([
        'meet',
        'attendee.id',
        'attendee.username',
        'attendee.gender',
        'attendee.birth',
      ])
      .where('meet.id = :id', { id: id });

    try {
      return await query.getOneOrFail();
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        this.logger.error(`Meet ${id} not found`);
        throw new BadRequestException(`Meet ${id} not found`);
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          `An exception occured while fetching meet ${id}`,
        );
      }
    }
  }

  /**
   * Create a new Proejct
   *
   * @param meetCreationDto
   * @returns
   */
  async createMeet(
    meetCreationDto: MeetCreationDto,
    user: User,
  ): Promise<Meet> {
    const meet = new Meet();
    const { name, description, start, end, seats } = meetCreationDto;

    meet.name = name;
    meet.description = description;
    meet.creator = user;

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

  async joinMeet(id: string, user: User) {
    const meet = await this.findOneBy({ id: id });

    if (meet.available_seats > 0) {
      try {
        await this.createQueryBuilder('meet')
          .relation(Meet, 'attendees')
          .of(meet)
          .add(user);

        meet.available_seats = meet.available_seats - 1;
        await meet.save();

        this.logger.verbose(
          `User w/ id ${user.id} joined meet w/ id ${meet.id}`,
        );
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('User Already joined the Meet');
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      }
    } else {
      this.logger.verbose(
        `User w/ id ${user.id} cannot join meet w/ id ${meet.id}: No Remaining Seats`,
      );
    }
  }

  async leaveMeet(id: string, user: User) {
    const meet = await this.findOneBy({ id: id });

    try {
      await this.createQueryBuilder('meet')
        .relation(Meet, 'attendees')
        .of(meet)
        .remove(user);

      meet.available_seats = meet.available_seats + 1;
      await meet.save();

      this.logger.verbose(`User w/ id ${user.id} left meet w/ id ${meet.id}`);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
}
