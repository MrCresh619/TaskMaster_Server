import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  register(createUserInput: CreateUserInput) {
    return this.prisma.user.create({data: createUserInput});
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string, password: string) {
    return this.prisma.user.findFirst({
      where: {
        username: username,
        password: password,
      },
    });
  }

  update(username: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${username} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
