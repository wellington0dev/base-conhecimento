import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { sanitizeUser, SafeUser } from '../users/utils/sanitize-user';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface LoginResult {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<LoginResult> {
    const user = await this.validateCredentials(username, password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: sanitizeUser(user),
    };
  }

  private async validateCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    if (!user.active) {
      throw new ForbiddenException(
        'Usuário desativado. Contate um administrador.',
      );
    }

    return user;
  }
}
