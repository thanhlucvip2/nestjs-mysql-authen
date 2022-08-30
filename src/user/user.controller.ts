import { ValidationPipe } from './../shared/validation.pipe';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  showAllUser() {
    return this.userService.showAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDto) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDto) {
    return this.userService.register(data);
  }
}
