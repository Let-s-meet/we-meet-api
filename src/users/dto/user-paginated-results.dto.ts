import { User } from '../orm/user.entity';

export class UserPaginatedResultsDto {
  users: User[];
  page: number;
  perPage: number;
  total: number;
}
