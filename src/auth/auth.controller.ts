import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/signup-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Res() res, @Body() dto: CreateAuthDto) {
    const result = await this.authService.signup(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      status: true,
      message: 'User signup sucess',
      result,
    });
  }

  @Post('/login')
  async login(@Res() res, @Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      status: true,
      message: 'Login successfully',
      result,
    });
  }
}
