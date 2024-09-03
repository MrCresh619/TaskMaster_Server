import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;
  @Field()
  access_token_expires_at: string;

  @Field()
  refresh_token: string;
  @Field()
  refresh_token_expires_at: string;
}
