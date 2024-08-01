// user.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { AuthResponse } from 'src/auth/dto/auth-response.dto';
import { User } from './entities/user.entity';
import { LogoutResponse } from 'src/auth/dto/logout-response.dto';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('username') username: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(GqlAuthGuard)
  async logout(@Context() context: any) {
    const token = context.req.headers.authorization.split(' ')[1]; // Pobranie tokena z nagłówka
    await this.authService.invalidateToken(token);
    return { success: true };
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async allUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  getMe(@Context() context: any): any {
    return context.req.user;
  }
}
