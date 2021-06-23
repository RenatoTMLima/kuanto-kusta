import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { CredentialsDTO } from './dtos/credentials.dto';
import { AccessTokenDTO } from './dtos/accessToken.dto';

@Injectable()
export class AuthRepository {
  constructor(private httpService: HttpService) {}

  async signUp(credentials: CredentialsDTO): Promise<void> {
    try {
      await this.httpService.post<void>('/signUp', credentials).toPromise();

      return;
    } catch (error) {
      throw new BadRequestException('Error trying to create a new user.');
    }
  }

  async signIn(credentials: CredentialsDTO): Promise<AccessTokenDTO> {
    try {
      const response = await this.httpService
        .post<AccessTokenDTO>('/signIn', credentials)
        .toPromise();

      return response.data;
    } catch (error) {
      throw new BadRequestException('Error trying to sign in user.');
    }
  }
}
