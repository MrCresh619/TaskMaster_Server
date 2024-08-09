import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { PrismaModule } from 'src/prisma/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
