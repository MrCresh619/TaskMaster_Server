import { ObjectType, Field } from '@nestjs/graphql';
import { Status } from './types';
@ObjectType()
export class Task {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Date, { defaultValue: new Date() })
  createDate: Date;

  @Field(() => Status, { defaultValue: Status.ACTIVE })
  status: Status;

  @Field(() => Date, { nullable: true })
  taskDate?: Date;

  @Field(() => Boolean, { defaultValue: false })
  isEvent: boolean;

  @Field(() => Date, { nullable: true })
  eventStart?: Date;

  @Field(() => Date, { nullable: true })
  eventEnd?: Date;
}
