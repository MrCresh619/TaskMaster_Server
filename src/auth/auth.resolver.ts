// auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { LogoutResponse } from './dto/logout-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('token') token: string) {
    await this.authService.invalidateToken(token);
    return { success: true };
  }
}
