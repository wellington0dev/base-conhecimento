import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const configService = app.get(ConfigService);
    const usersService = app.get(UsersService);

    const username = configService.get<string>('ADMIN_USERNAME');
    const password = configService.get<string>('ADMIN_PASSWORD');
    const name = configService.get<string>('ADMIN_NAME');

    if (!username || !password || !name) {
      console.error(
        'ADMIN_USERNAME, ADMIN_PASSWORD e ADMIN_NAME precisam estar definidos no .env para rodar o seed.',
      );
      process.exitCode = 1;
      return;
    }

    const existing = await usersService.findByUsername(username);
    if (existing) {
      console.log(
        `Usuário admin "${username}" já existe. Nenhuma ação necessária.`,
      );
      return;
    }

    await usersService.create({
      username,
      password,
      name,
      role: UserRole.ADMIN,
    });
    console.log(`Usuário admin "${username}" criado com sucesso.`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error('Erro ao rodar o seed do admin:', error);
  process.exitCode = 1;
});
