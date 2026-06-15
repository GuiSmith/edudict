# edudict

edudict é um sistema web de gerenciamento de estoque, dividido em front-end Next.js e back-end Express com Prisma ORM e PostgreSQL.

## Tecnologias

### Front-end

* Next.js.
* React.
* Material UI.
* Scalar para visualização da documentação OpenAPI.

### Back-end

* Node.js.
* Express.js.
* API REST.
* Prisma ORM.
* JWT/token persistido para autenticação.
* Middlewares de autenticação, logs e erros.

### Banco e serviços

* PostgreSQL.
* Docker e Docker Compose.
* RabbitMQ previsto para fila de e-mails.
* OperaFR previsto para armazenamento e gerenciamento de arquivos.

## Estrutura principal

* `front/`: aplicação web em Next.js.
* `back/`: API Express.
* `infra/`: arquivos Docker Compose e `.env.example`.
* `Makefile`: comandos operacionais para subir, parar e migrar ambientes.
* `.agents/CORE/`: documentação central do projeto.

## Configuração de ambiente

Para Docker, copie o arquivo de exemplo:

```bash
cp infra/.env.example infra/.env
```

Variáveis principais:

* `DB_HOST`
* `DB_PORT`
* `DB_USER`
* `DB_PASS`
* `DB_NAME`
* `DATABASE_URL`
* `BACK_HOST_PORT_DEV`
* `FRONT_HOST_PORT_DEV`

## Ambiente de desenvolvimento

Subir a stack de desenvolvimento:

```bash
make dev-up
```

Parar a stack de desenvolvimento:

```bash
make dev-down
```

Containers esperados em desenvolvimento:

* `edudict-dev-db`: PostgreSQL.
* `edudict-dev-back`: back-end.
* `edudict-dev-front`: front-end.

Portas padrão conforme `infra/.env.example`:

* Front-end dev: `http://localhost:8081`.
* Back-end dev: `http://localhost:3011`.
* PostgreSQL dev: `localhost:5435`.

## Ambiente de produção local

Subir a stack de produção local:

```bash
make prod-up
```

Parar a stack de produção local:

```bash
make prod-down
```

Portas padrão conforme `infra/.env.example`:

* Front-end: `http://localhost:8080`.
* Back-end: `http://localhost:3010`.
* PostgreSQL: `localhost:5432`.

## Banco de dados e migrations

As migrations são SQL manuais em:

```text
back/src/database/migrations
```

O script de migração fica em:

```text
back/src/database/migrate.js
```

Fluxo de sincronização do banco no back-end:

```bash
npm run db:sync
```

Esse comando executa:

```bash
npm run migrate
npx prisma db pull
npx prisma generate
```

Pelo Makefile, no ambiente de desenvolvimento:

```bash
make dev-migrate
```

No ambiente de produção local:

```bash
make prod-migrate
```

## Prisma

Comandos disponíveis no pacote `back/`:

```bash
npm run migrate
npm run db:pull
npm run db:generate
npm run db:sync
```

O schema Prisma fica em:

```text
back/prisma/schema.prisma
```

## Acesso ao PostgreSQL

Ambiente de desenvolvimento:

```bash
make dev-psql
```

Ambiente de produção local:

```bash
make prod-psql
```

## Scripts dos pacotes

### Back-end

No pacote `back/`:

```bash
npm run dev
npm run start
npm run migrate
npm run db:pull
npm run db:generate
npm run db:sync
```

### Front-end

No pacote `front/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Documentação da API

O contrato OpenAPI fica em:

```text
front/docs/api/openapi.yml
```

Esse arquivo é usado para gerar a visualização da API com Scalar.

## Observações operacionais

* Não versionar `.env`, secrets, dumps de banco ou dependências geradas.
* Não alterar Dockerfiles ou arquivos Docker Compose sem necessidade explícita de infraestrutura.
* Para executar comandos no projeto, preferir `docker exec <container-name> <command>` quando a stack estiver dockerizada.
