import { MeetStatus } from '../enum/meet-status.enum';

export class MeetPaginationDto {
  page: number;
  perPage: number;
  q: string;
  status: MeetStatus;
}
