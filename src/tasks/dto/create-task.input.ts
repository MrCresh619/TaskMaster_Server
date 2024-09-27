import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string

  @Field(() => Date, {nullable: true})
  taskDate: Date;

  @Field(() => Boolean, { defaultValue: false })
  isEvent: boolean;

  @Field(() => Date, {nullable: true})
  eventStart: Date;

  @Field(() => Date, {nullable: true})
  eventEnd: Date;
}