import { Meet } from '../orm/meet.entity';

export class MeetPaginatedResultsDto {
  meets: Meet[];
  page: number;
  perPage: number;
  total: number;
}
