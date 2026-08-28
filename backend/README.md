# Backend — Base de Conhecimento (KB)

Backend em NestJS + TypeORM + SQLite para a base de conhecimento interna
usada por estagiários de TI (rede, impressora, internet, etc).

## Stack

- NestJS + TypeScript
- TypeORM + SQLite local (`better-sqlite3`, sem serviços externos)
- Autenticação via JWT (`@nestjs/jwt` + `passport-jwt`)
- Validação de entrada com `class-validator`

## Rodando o projeto

```bash
npm install
cp .env.example .env   # e ajuste os valores
npm run seed:admin     # cria o primeiro usuário admin
npm run start:dev
```

## Variáveis de ambiente

| Variável         | Obrigatória | Padrão              | Descrição                                                        |
| ---------------- | :---------: | -------------------- | ------------------------------------------------------------------ |
| `PORT`           |     não     | `3000`                | Porta HTTP do servidor                                             |
| `DATABASE_PATH`  |     não     | `database.sqlite`     | Caminho do arquivo SQLite                                          |
| `JWT_SECRET`     |     sim     | —                     | Segredo usado para assinar/verificar os tokens JWT                 |
| `JWT_EXPIRES_IN` |     não     | `7d`                  | Expiração do token (formato aceito pela lib `ms`, ex: `1h`, `30d`) |
| `ADMIN_USERNAME` |     sim*    | —                     | Username do admin criado pelo `npm run seed:admin`                 |
| `ADMIN_PASSWORD` |     sim*    | —                     | Senha do admin criado pelo `npm run seed:admin`                    |
| `ADMIN_NAME`     |     sim*    | —                     | Nome do admin criado pelo `npm run seed:admin`                     |

\* Só são obrigatórias para rodar `npm run seed:admin`. A aplicação em si roda sem elas.

Veja `.env.example` para um modelo pronto.

## Seed do primeiro admin

Como não existe registro público, o primeiro usuário admin precisa ser
criado via script standalone:

```bash
npm run seed:admin
```

O script lê `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `ADMIN_NAME` do `.env` e:

- Cria o usuário admin caso ainda não exista um com aquele `username`.
- Se já existir, apenas avisa e sai sem alterar nada — é seguro rodar
  quantas vezes for necessário.

Depois disso, todo novo usuário (admin, intern ou employee) deve ser criado
por um admin já logado, via `POST /users`.

## Rotas de autenticação

Todas as rotas abaixo têm prefixo `/auth`.

### `POST /auth/login`

Login com `username` + senha (não é por e-mail). Não exige autenticação.

**Body:**

```json
{
  "username": "admin",
  "password": "minha-senha"
}
```

**Resposta `200 OK`:**

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "name": "Administrador",
    "role": "admin",
    "active": true,
    "createdAt": "2026-08-24T12:00:00.000Z",
    "updatedAt": "2026-08-24T12:00:00.000Z"
  }
}
```

**Erros:**

- `401 Unauthorized` — username ou senha inválidos.
- `403 Forbidden` — usuário existe e a senha está correta, mas `active` é `false`.

### `GET /auth/me`

Retorna os dados do usuário logado. **Protegida**: exige JWT válido
(qualquer papel).

**Headers:** `Authorization: Bearer <accessToken>`

**Resposta `200 OK`:**

```json
{
  "id": "uuid",
  "username": "admin",
  "name": "Administrador",
  "role": "admin",
  "active": true,
  "createdAt": "2026-08-24T12:00:00.000Z",
  "updatedAt": "2026-08-24T12:00:00.000Z"
}
```

**Erros:**

- `401 Unauthorized` — sem token ou token inválido/expirado.
- `403 Forbidden` — token válido, mas o usuário foi desativado depois de
  emitido (a checagem de `active` acontece a cada requisição).

## Rotas de gestão de usuários

Todas as rotas abaixo têm prefixo `/users`.

### `POST /users`

Cria um novo usuário. **Protegida**: exige JWT válido + papel `admin`.

**Headers:** `Authorization: Bearer <accessToken>`

**Body:**

```json
{
  "name": "Nome do estagiário",
  "username": "novo_usuario",
  "password": "senha-com-6-ou-mais-caracteres",
  "role": "intern"
}
```

`role` é opcional (padrão `intern`). Valores aceitos: `intern` | `admin` | `employee`.

**Resposta `201 Created`** — usuário criado, sem `passwordHash`:

```json
{
  "id": "uuid",
  "username": "novo_usuario",
  "name": "Nome do estagiário",
  "role": "intern",
  "active": true,
  "createdAt": "2026-08-24T12:00:00.000Z",
  "updatedAt": "2026-08-24T12:00:00.000Z"
}
```

**Erros:**

- `400 Bad Request` — corpo inválido (ex.: `username` com menos de 3
  caracteres, `password` com menos de 6, `name` vazio, `role` fora de
  `intern`/`admin`/`employee`).
- `401 Unauthorized` — sem token ou token inválido/expirado.
- `403 Forbidden` — token válido, mas o usuário logado não é `admin` (ou
  foi desativado depois que o token foi emitido).
- `409 Conflict` — já existe um usuário com esse `username`.

### `GET /users`

Lista todos os usuários cadastrados, ordenados por `createdAt` decrescente
(mais recentes primeiro). **Protegida**: exige JWT válido + papel `admin`.

**Headers:** `Authorization: Bearer <accessToken>`

**Resposta `200 OK`** — lista de usuários, sem `passwordHash`:

```json
[
  {
    "id": "uuid",
    "username": "novo_usuario",
    "name": "Nome do estagiário",
    "role": "intern",
    "active": true,
    "createdAt": "2026-08-24T12:00:00.000Z",
    "updatedAt": "2026-08-24T12:00:00.000Z"
  }
]
```

**Erros:**

- `401 Unauthorized` — sem token ou token inválido/expirado.
- `403 Forbidden` — token válido, mas o usuário logado não é `admin`.

### `PATCH /users/me`

Permite ao próprio usuário logado editar `name` e/ou `password`.
**Protegida**: exige JWT válido (qualquer papel). Não permite alterar
`role` ou `active` — enviar esses campos resulta em `400 Bad Request`.

**Headers:** `Authorization: Bearer <accessToken>`

**Body** (todos os campos opcionais, mas ao menos um deve ser enviado):

```json
{
  "name": "Novo nome",
  "password": "nova-senha-com-6-ou-mais-caracteres"
}
```

**Resposta `200 OK`** — usuário atualizado, sem `passwordHash`:

```json
{
  "id": "uuid",
  "username": "novo_usuario",
  "name": "Novo nome",
  "role": "intern",
  "active": true,
  "createdAt": "2026-08-24T12:00:00.000Z",
  "updatedAt": "2026-08-24T12:05:00.000Z"
}
```

**Erros:**

- `400 Bad Request` — corpo inválido (ex.: `name` com menos de 2
  caracteres, `password` com menos de 6, ou tentativa de enviar `role`/`active`).
- `401 Unauthorized` — sem token ou token inválido/expirado.
- `403 Forbidden` — token válido, mas o usuário foi desativado depois de
  emitido.

### `PATCH /users/:id`

Permite a um admin editar `name`, `password`, `role` e/ou `active` de
qualquer usuário. **Protegida**: exige JWT válido + papel `admin`.

Um admin não pode desativar a própria conta (`active: false` no próprio
`id`) — isso evita que ele fique trancado para fora do sistema sem outro
admin disponível para reverter. Nada impede, porém, que ele altere o
próprio `name`, `password` ou `role`.

**Headers:** `Authorization: Bearer <accessToken>`

**Body** (todos os campos opcionais, mas ao menos um deve ser enviado):

```json
{
  "name": "Novo nome",
  "password": "nova-senha-com-6-ou-mais-caracteres",
  "role": "admin",
  "active": false
}
```

**Resposta `200 OK`** — usuário atualizado, sem `passwordHash`:

```json
{
  "id": "uuid",
  "username": "novo_usuario",
  "name": "Novo nome",
  "role": "admin",
  "active": false,
  "createdAt": "2026-08-24T12:00:00.000Z",
  "updatedAt": "2026-08-24T12:10:00.000Z"
}
```

**Erros:**

- `400 Bad Request` — corpo inválido (ex.: `role` fora de
  `intern`/`admin`/`employee`, `name` com menos de 2 caracteres, `password`
  com menos de 6).
- `401 Unauthorized` — sem token ou token inválido/expirado.
- `403 Forbidden` — token válido, mas o usuário logado não é `admin`, ou é
  `admin` tentando desativar (`active: false`) a própria conta.
- `404 Not Found` — não existe usuário com o `id` informado.

## Rotas de artigos

Todas as rotas abaixo têm prefixo `/articles`. **Todas exigem apenas JWT
válido** (qualquer papel) — não há restrição de dono: qualquer usuário
autenticado pode editar ou excluir artigos criados por outra pessoa.

O corpo (`body`) é markdown puro (sem sanitização/renderização no backend
— isso é responsabilidade do frontend ao exibir). O campo `excerpt` é
opcional: se não for enviado, é derivado automaticamente do `body`
(remove sintaxe markdown e trunca a ~160 caracteres).

### `POST /articles`

Cria um novo artigo. O usuário autenticado vira `author` e `lastEditor`.

**Headers:** `Authorization: Bearer <accessToken>`

**Body:**

```json
{
  "title": "Como resetar a impressora",
  "category": "impressora",
  "body": "## Passo 1\nDesligue a impressora.\n\n## Passo 2\nEspere 10 segundos e ligue de novo."
}
```

`excerpt` é opcional (ver acima).

**Resposta `201 Created`:**

```json
{
  "id": "uuid",
  "title": "Como resetar a impressora",
  "category": "impressora",
  "excerpt": "Passo 1 Desligue a impressora. Passo 2 Espere 10 segundos e ligue de novo.",
  "body": "## Passo 1\nDesligue a impressora.\n\n## Passo 2\nEspere 10 segundos e ligue de novo.",
  "author": { "id": "uuid", "username": "admin", "name": "Administrador", "role": "admin", "active": true, "createdAt": "...", "updatedAt": "..." },
  "lastEditor": { "id": "uuid", "username": "admin", "name": "Administrador", "role": "admin", "active": true, "createdAt": "...", "updatedAt": "..." },
  "createdAt": "2026-08-25T18:34:54.000Z",
  "updatedAt": "2026-08-25T18:34:54.000Z"
}
```

**Erros:**

- `400 Bad Request` — corpo inválido (`title` com menos de 3 caracteres,
  `category` vazio, `body` com menos de 10 caracteres).
- `401 Unauthorized` — sem token ou token inválido/expirado.

### `GET /articles`

Lista todos os artigos, ordenados por `updatedAt` decrescente (editados
mais recentemente aparecem primeiro).

**Headers:** `Authorization: Bearer <accessToken>`

**Resposta `200 OK`:** array de artigos no mesmo formato do `POST /articles`.

### `GET /articles/:id`

Retorna um artigo específico, no mesmo formato acima.

**Erros:**

- `401 Unauthorized` — sem token ou token inválido/expirado.
- `404 Not Found` — não existe artigo com o `id` informado.

### `PATCH /articles/:id`

Edita `title`, `category`, `excerpt` e/ou `body` de qualquer artigo. O
usuário autenticado vira o novo `lastEditor` (o `author` original nunca
muda). Se `body` for enviado sem `excerpt`, o excerpt é re-derivado
automaticamente do novo `body`.

**Body** (todos os campos opcionais, mas ao menos um deve ser enviado):

```json
{
  "title": "Como resetar a impressora HP"
}
```

**Resposta `200 OK`:** artigo atualizado, no mesmo formato do `POST /articles`.

**Erros:**

- `400 Bad Request` — corpo inválido.
- `401 Unauthorized` — sem token ou token inválido/expirado.
- `404 Not Found` — não existe artigo com o `id` informado.

### `DELETE /articles/:id`

Exclui o artigo permanentemente (hard delete — sem soft-delete/arquivamento).

**Resposta:** `204 No Content`.

**Erros:**

- `401 Unauthorized` — sem token ou token inválido/expirado.
- `404 Not Found` — não existe artigo com o `id` informado.

## Comportamento de segurança relevante

- Nenhuma resposta da API retorna `passwordHash`.
- Senhas são armazenadas com `bcrypt` (10 salt rounds).
- Desativar um usuário (`active = false`) bloqueia login imediatamente
  **e** invalida qualquer token JWT já emitido para ele — a checagem de
  `active` acontece tanto no login quanto a cada requisição autenticada
  (na `JwtStrategy`), não é preciso esperar o token expirar.
- Não existe endpoint de registro público — só um admin autenticado pode
  criar novos usuários.
