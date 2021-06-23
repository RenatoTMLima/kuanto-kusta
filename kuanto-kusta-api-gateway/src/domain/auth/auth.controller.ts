import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenDTO } from './dtos/accessToken.dto';
import { CredentialsDTO } from './dtos/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() credentials: CredentialsDTO): Promise<void> {
    return this.authService.signUp(credentials);
  }

  @Post('/signIn')
  @HttpCode(200)
  async signIn(@Body() credentials: CredentialsDTO): Promise<AccessTokenDTO> {
    return this.authService.signIn(credentials);
  }
}
