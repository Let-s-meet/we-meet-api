import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/orm/user.entity';


const AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
const AWS_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
