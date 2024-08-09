import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput, @Context() context?: any) {
    return this.tasksService.create(createTaskInput, context.req.user.id);
  }

  @Query(() => [Task], { name: 'tasks' })
  @UseGuards(GqlAuthGuard)
  findAll(@Context() context: any) {
    const userId = context.req.user.id
    return this.tasksService.findAll(userId);
  }

  @Query(() => Task, { name: 'task' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => String }) id: string,  @Context() context: any) {
    const userId = context.req.user.id
    return this.tasksService.findOne(id, userId);
  }

  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  updateTask(@Context() context: any, @Args('updateTaskInput') updateTaskInput: UpdateTaskInput, ) {
    return this.tasksService.update(updateTaskInput.id, context.req.user.id, updateTaskInput);
  }

  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  removeTask(@Args('id', { type: () => String }) id: string, @Context() context: any) {
    return this.tasksService.remove(id, context.req.user.id);
  }
  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  archiveTask( @Args('id', { type: () => String }) id: string, @Context() context: any){
    return this.tasksService.archiveTask(id, context.req.user.id)
  }
}
