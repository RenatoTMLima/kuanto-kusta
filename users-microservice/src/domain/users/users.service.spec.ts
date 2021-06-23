import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService Tests', () => {
  let usersService: UsersService;

  const usersRepositoryMock = {
    createUser: jest.fn(),
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
    const usersModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    const newUserData = {
      email: 'user@test.com',
      password: '$2b$10$xUjnGKslxzIEw8CIIVGPde89BmNcYNIENI.TjEn0UflPm0naJSchK',
      salt: '$2b$10$xUjnGKslxzIEw8CIIVGPdewuUrMhdQJ6odTEwwQsbvoOfBGLwO/4y',
    };

    await usersService.createNewUser(newUserData);

    expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(newUserData);
  });

  it('should find a user passing the email', async () => {
    const email = 'user@test.com';

    const user = await usersService.findUserByEmail(email);

    expect(user.password).toEqual(
      '$2b$10$xUjnGKslxzIEw8CIIVGPde89BmNcYNIENI.TjEn0UflPm0naJSchK',
    );
    expect(user._id).toEqual('userId');
    expect(user.salt).toEqual(
      '$2b$10$xUjnGKslxzIEw8CIIVGPdewuUrMhdQJ6odTEwwQsbvoOfBGLwO/4y',
    );
  });

  it('should return undefined for trying to retrieve a non existing user', async () => {
    const email = 'notAUser@test.com';

    const user = await usersService.findUserByEmail(email);

    expect(user).toEqual(undefined);
  });
});
