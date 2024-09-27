import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskInput: CreateTaskInput, userId: string) {
    const taskData = {
      ...createTaskInput,
      userId,
    };

    return this.prisma.task.create({
      data: taskData,
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.task.findFirst({ where: { id, userId } });
  }

  async update(id: string, userId: string, updateTaskInput: UpdateTaskInput) {
    await this.ensureTaskExists(id, userId);

    return this.prisma.task.update({
      data: updateTaskInput,
      where: { id },
    });
  }

  async archiveTask(id: string, userId: string) {
    await this.ensureTaskExists(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async remove(id: string, userId: string) {
    await this.ensureTaskExists(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  // Metoda pomocnicza do sprawdzania, czy zadanie istnieje i należy do użytkownika
  private async ensureTaskExists(id: string, userId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new Error('Task not found or not authorized');
    }
  }
}
