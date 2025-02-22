import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TeamModule } from 'src/team/team.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [TeamModule, TaskModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
