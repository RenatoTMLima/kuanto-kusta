import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { ValidatedJWTDTO } from './dtos/validatedJwt.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<void> {
    return this.authService.signUp(credentialsDto);
  }

  @Post('/signIn')
  @HttpCode(200)
  signIn(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(credentialsDto);
  }

  @Post('/validateToken')
  @HttpCode(200)
  validateToken(
    @Body('accessToken') accessToken: string,
  ): Promise<ValidatedJWTDTO> {
    return this.authService.validateToken(accessToken);
  }
}
