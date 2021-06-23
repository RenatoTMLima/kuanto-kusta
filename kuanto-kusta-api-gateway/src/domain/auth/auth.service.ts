import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AccessTokenDTO } from './dtos/accessToken.dto';
import { CredentialsDTO } from './dtos/credentials.dto';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async signUp(credentials: CredentialsDTO): Promise<void> {
    return this.authRepository.signUp(credentials);
  }

  async signIn(credentials: CredentialsDTO): Promise<AccessTokenDTO> {
    return this.authRepository.signIn(credentials);
  }
}
