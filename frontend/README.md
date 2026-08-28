# Knowledge Base — Frontend

Aplicação Angular do Knowledge Base: um sistema de gestão de artigos com autenticação, controle de acesso por papéis (roles) e edição de conteúdo em Markdown.

## Stack

- [Angular 22](https://angular.dev/) (standalone components)
- [Angular Material](https://material.angular.io/) + Angular CDK
- [RxJS](https://rxjs.dev/)
- [marked](https://marked.js.org/) para renderização de Markdown
- [Vitest](https://vitest.dev/) para testes unitários

## Funcionalidades

- **Autenticação** (`/auth`) — login/registro, com guards que redirecionam usuários já logados.
- **Artigos** (`/articles`, `/articles/:id`) — listagem, criação, edição e exclusão de artigos, com editor Markdown.
- **Usuários** (`/users`) — gestão de usuários, restrita a administradores (`role-guard`).
- **Interceptor de autenticação** — anexa o token às requisições HTTP automaticamente.

## Pré-requisitos

- Node.js compatível com Angular CLI 22
- npm
- Backend do Knowledge Base rodando (ver [`../backend`](../backend)) — por padrão em `http://localhost:8030`, configurável em [`src/environment`](src/environment)

## Instalação

```bash
npm install
```

## Servidor de desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/`. A aplicação recarrega automaticamente ao alterar os arquivos-fonte.

## Build

```bash
npm run build
```

Os artefatos de build são gerados em `dist/frontend`.

Para gerar um build em modo watch (desenvolvimento):

```bash
npm run watch
```

## Testes

Testes unitários com [Vitest](https://vitest.dev/):

```bash
npm test
```

## Estrutura do projeto

```
src/app/
├── core/            # guards, interceptors, services e types compartilhados
├── pages/           # páginas roteadas (auth, articles, article-detail, users)
└── shared/          # componentes, diálogos e pipes reutilizáveis (toolbar, markdown-editor, dialogs de confirmação)
```

## Scaffolding

Para gerar um novo componente com o Angular CLI:

```bash
ng generate component nome-do-componente
```

Para ver todos os schematics disponíveis (components, directives, pipes, etc.):

```bash
ng generate --help
```

## Recursos adicionais

Para mais informações sobre o Angular CLI, consulte a [documentação oficial](https://angular.dev/tools/cli).
