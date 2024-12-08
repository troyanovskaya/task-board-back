import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { TeamService } from 'src/team/team.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly teamService: TeamService){}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() registerUserDTo: RegisterUserDto) {
    const authResponse = this.userService.registerUser(registerUserDTo);
    const newTeam = {adminId: (await authResponse).id, members: [(await authResponse).id],
      description: "Personal space. Here you can post all your tasks",
      name: "Saved",
      default: true}
    this.teamService.create(newTeam);
    return authResponse;
  }
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Post('email')
  @UsePipes(new ValidationPipe({ transform: true }))
  email(@Body() body: {email:string}) {
    return this.userService.checkIfEmailIsUsed(body.email);
  }
}
