import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createNewUser(newUser: User): Promise<void> {
    return this.usersRepository.createUser(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findUserByEmail(email);
  }
}
