import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, TaskModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
