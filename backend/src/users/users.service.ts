import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { sanitizeUser, SafeUser } from './utils/sanitize-user';

const SALT_ROUNDS = 10;

export interface CreateUserInput {
  username: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<SafeUser> {
    const existing = await this.findByUsername(input.username);
    if (existing) {
      throw new ConflictException(
        `Já existe um usuário com o username "${input.username}".`,
      );
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = this.usersRepository.create({
      username: input.username,
      passwordHash,
      name: input.name,
      role: input.role ?? UserRole.INTERN,
    });

    const saved = await this.usersRepository.save(user);
    return sanitizeUser(saved);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map(sanitizeUser);
  }

  async updateUser(id: string, changes: UpdateUserInput): Promise<SafeUser> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com id "${id}" não encontrado.`);
    }

    if (changes.name !== undefined) {
      user.name = changes.name;
    }
    if (changes.role !== undefined) {
      user.role = changes.role;
    }
    if (changes.active !== undefined) {
      user.active = changes.active;
    }
    if (changes.password !== undefined) {
      user.passwordHash = await bcrypt.hash(changes.password, SALT_ROUNDS);
    }

    const saved = await this.usersRepository.save(user);
    return sanitizeUser(saved);
  }
}
