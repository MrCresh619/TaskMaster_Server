// user.resolver.ts
import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [User])
  async allUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  getMe(@Context() context: any): any {
    return context.req.user;
  }
}
