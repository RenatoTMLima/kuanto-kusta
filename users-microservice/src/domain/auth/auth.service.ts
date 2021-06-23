import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CredentialsDto } from './dtos/credentials.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { ValidatedJWTDTO } from './dtos/validatedJwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async signUp(credentialsDto: CredentialsDto): Promise<void> {
    const { email, password } = credentialsDto;

    const userExists = await this.usersService.findUserByEmail(email);

    if (userExists) throw new ConflictException('User already exists.');

    const salt = await bcrypt.genSalt();

    const user = {
      email,
      salt,
      password: await this.hashPassword(password, salt),
    };

    this.usersService.createNewUser(user);
  }

  public async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    const validatedUser = await this.validatePassword(credentialsDto);

    if (!validatedUser) throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtPayload = validatedUser;
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  public async validateToken(accessToken: string): Promise<ValidatedJWTDTO> {
    try {
      const jwtSecret = this.configService.get<JwtVerifyOptions>('JWT_SECRET');
      const result = this.jwtService.verify(accessToken, jwtSecret);
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  private async validatePassword(
    credentialsDto: CredentialsDto,
  ): Promise<JwtPayload> {
    const { email, password } = credentialsDto;
    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid =
      (await this.hashPassword(password, user.salt)) === user.password;

    if (user && isPasswordValid) return { email: user.email, userId: user._id };
    else return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
