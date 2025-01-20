import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterUserDTO } from './dto/register.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/login.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // @Get('admin')
  // @Roles(Role.ADMIN)
  // findAdminData() {
  //   return 'Admin data';
  // }

  // @Get('user')
  // @Public()
  // findUserData() {
  //   return 'User data';
  // }
  @Post('register')
  @Public()
  public async register(@Body() user: RegisterUserDTO) {
    return this.userService.register(user);
  }

  @Post('login')
  @Public()
  public async login(@Body() user: LoginUserDTO) {
    return this.userService.login(user);
  }
}
