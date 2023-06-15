import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/orm/user.entity';

database = aws_lib.connect("AKIAXITLBWRMQTENCYWL", "9BpQbObwT/VYNcbRbhOIQEAXtXPLfGi8TaFnLbUn")

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
