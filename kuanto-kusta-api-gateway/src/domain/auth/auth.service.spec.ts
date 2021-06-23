import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

describe('AuthService Tests', () => {
  let authService: AuthService;

  const authRepositoryMock = {
    signUp: jest.fn().mockImplementation((credentials) => {
      if (credentials.password === 'weakPassword')
        throw new BadRequestException('Error trying to create a new user.');

      return;
    }),
    signIn: jest.fn().mockImplementation((credentials) => {
      if (credentials.email !== 'user@test.com')
        throw new BadRequestException('Error trying to sign in user.');

      return {
        accessToken: 'jwtvalidtoken',
      };
    }),
  };

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: authRepositoryMock,
        },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
  });

  it('should sign up a new user successfully', async () => {
    const newUser = { email: 'newUser@test.com', password: 'strongPassword' };

    await authService.signUp(newUser);

    expect(authRepositoryMock.signUp).toHaveBeenLastCalledWith(newUser);
  });

  it('should throw error trying to sign up with a weak password', async () => {
    const newUser = { email: 'newUser@test.com', password: 'weakPassword' };

    await authService.signUp(newUser).catch((error) => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Error trying to create a new user.');
    });

    expect(authRepositoryMock.signUp).toHaveBeenLastCalledWith(newUser);
  });

  it('should sign in a user successfully', async () => {
    const credentials = {
      email: 'user@test.com',
      password: 'strongPassword',
    };

    const token = await authService.signIn(credentials);

    expect(authRepositoryMock.signIn).toHaveBeenLastCalledWith(credentials);
    expect(token.accessToken).toEqual('jwtvalidtoken');
  });

  it('should throw error trying to sign in a non existing user', async () => {
    const invalidCredentials = {
      email: 'notAUser@test.com',
      password: 'strongPassword',
    };

    await authService.signIn(invalidCredentials).catch((error) => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Error trying to sign in user.');
    });

    expect(authRepositoryMock.signIn).toHaveBeenLastCalledWith(
      invalidCredentials,
    );
  });
});
