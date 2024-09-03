// auth.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { LogoutResponse } from './dto/logout-response.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
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
  @Mutation(() => AuthResponse)
  async refreshToken(@Args('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Mutation(() => User)
  async registerUser(@Args('email') email: string, @Args('password') password: string, @Args('username') username: string){
    return this.authService.register(email, password, username)
  }
}
