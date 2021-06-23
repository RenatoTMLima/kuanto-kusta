import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService Tests', () => {
  let authService: AuthService;

  const jwtServiceMock = {
    verify: jest.fn().mockImplementation((accessToken, secret) => {
      if (accessToken !== 'jwtvalidaccesstoken')
        throw new Error('Invalid token');

      return {
        email: 'user@test.com',
        userId: 'userId',
      };
    }),
    sign: jest.fn().mockImplementation(() => 'jwtvalidaccesstoken'),
  };

  const configServiceMock = {
    get: jest.fn().mockImplementation((secret) => secret),
  };

  const usersServiceMock = {
    createNewUser: jest.fn(),
    findUserByEmail: jest.fn().mockImplementation((email) => {
      if (email !== 'user@test.com') return undefined;

      return {
        _id: 'userId',
        email,
        password:
          '$2b$10$xUjnGKslxzIEw8CIIVGPde89BmNcYNIENI.TjEn0UflPm0naJSchK',
        salt: '$2b$10$xUjnGKslxzIEw8CIIVGPdewuUrMhdQJ6odTEwwQsbvoOfBGLwO/4y',
      };
    }),
  };

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    const credentials = { email: 'newUser@test.com', password: 'password' };

    await authService.signUp(credentials);

    expect(usersServiceMock.findUserByEmail).toHaveBeenCalledWith(
      credentials.email,
    );
    expect(usersServiceMock.createNewUser).toHaveBeenCalled();
  });

  it('should throw conflict error for trying to create a user with existing email', async () => {
    const credentials = { email: 'user@test.com', password: 'password' };

    await authService.signUp(credentials).catch((error) => {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('User already exists.');
    });
  });

  it('should successfully sign in user and return an accessToken', async () => {
    const credentials = { email: 'user@test.com', password: 'password' };

    const token = await authService.signIn(credentials);

    expect(token.accessToken).toEqual('jwtvalidaccesstoken');
  });

  it('should throw new error for trying to sign in a non existing user', async () => {
    const credentials = { email: 'notAUser@test.com', password: 'password' };

    await authService.signIn(credentials).catch((error) => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Invalid credentials.');
    });
  });

  it('should throw new error for trying to sign in with wrong password', async () => {
    const credentials = { email: 'user@test.com', password: 'wrongPassword' };

    await authService.signIn(credentials).catch((error) => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Invalid credentials.');
    });
  });

  it('should return email and userId for a valid access token', async () => {
    const accessToken = 'jwtvalidaccesstoken';

    const userData = await authService.validateToken(accessToken);

    expect(userData.email).toEqual('user@test.com');
    expect(userData.userId).toEqual('userId');
  });

  it('should throw new error for invalid token', async () => {
    const accessToken = 'jwtInvalidAccessToken';

    await authService.validateToken(accessToken).catch((error) => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Invalid token.');
    });
  });
});
