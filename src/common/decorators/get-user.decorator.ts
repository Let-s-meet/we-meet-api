import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/orm/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
