import { User } from '../entities/user.entity';

export type SafeUser = Omit<User, 'passwordHash'>;

export function sanitizeUser(user: User): SafeUser {
  const safeUser: Partial<User> = { ...user };
  delete safeUser.passwordHash;
  return safeUser as SafeUser;
}
