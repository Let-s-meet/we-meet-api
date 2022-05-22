import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsRegisterDto } from 'src/auth/dto/auth-credentials-register.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsLoginDto } from 'src/auth/dto/auth-credentials-login.dto';
import { User } from './user.entity';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { UserPaginationDto } from '../dto/user-pagination.dto';
import { UserPaginatedResultsDto } from '../dto/user-paginated-results.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async register(
    authCredentialsRegisterDto: AuthCredentialsRegisterDto,
  ): Promise<void> {
    const { email, username, password } = authCredentialsRegisterDto;
    const pirate = new User();
    pirate.email = email;
    pirate.username = username;
    pirate.salt = await bcrypt.genSalt();
    pirate.password = await this.hashPassword(password, pirate.salt);
    pirate.active = true;

    try {
      await pirate.save();
      this.logger.verbose(`User w/ id ${pirate.id} registered`);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username/Email already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsLoginDto: AuthCredentialsLoginDto,
  ): Promise<any> {
    const { email, password } = authCredentialsLoginDto;
    const user = await this.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password', 'salt', 'active'],
    });

    if (user && (await user.validatePassword(password))) {
      if (user && !user.active) {
        this.logger.debug(
          `Failed login attempt for inactive user w/ id: "${user.id}".`,
        );
        throw new UnauthorizedException(
          `Your account is not active for now. Check the email in your inbox`,
        );
      }

      return { username: user.username, email: user.email };
    } else {
      return null;
    }
  }

  async getPirates(
    filterDto: UserPaginationDto,
  ): Promise<UserPaginatedResultsDto> {
    const { page, perPage, q } = filterDto;
    const skippedItems = (page - 1) * perPage;
    const total = await this.count();

    const query = this.createQueryBuilder('pirate')
      .select([
        'pirate.id',
        'pirate.created',
        'pirate.username',
        'pirate.email',
        'pirate.avatar',
        'pirate.active',
        'pirate.lastSuccessfullLogin',
        'pirate.updated',
      ])
      .offset(page ? skippedItems : 0)
      .limit(perPage ? perPage : null)
      .orderBy('pirate.created', 'DESC');

    if (q) {
      query.andWhere('pirate.username LIKE :q OR pirate.email LIKE :q', {
        q: `%${q}%`,
      });
    }

    try {
      const users = await query.getMany();

      return {
        total,
        page: filterDto.page ? filterDto.page : 1,
        perPage: filterDto.perPage,
        users: users,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getPiratesCount(): Promise<number> {
    const data = await this.find({
      select: ['id'],
    });
    return data.length;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
