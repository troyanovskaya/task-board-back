import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [TeamModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
