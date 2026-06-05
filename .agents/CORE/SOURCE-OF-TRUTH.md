# Stocky — Sistema Web de Gerenciamento de Estoque

## Objetivo da solução

O objetivo do sistema é permitir o gerenciamento de estoque de uma organização com múltiplas filiais, almoxarifados, usuários e produtos.

A aplicação permitirá controlar:

* Produtos comuns
* Produtos únicos com número de série e MAC
* Movimentações de estoque
* Permissões de acesso
* Associação de usuários a almoxarifados
* Inventários de estoque

---

# Escopo principal

O sistema terá:

* Autenticação de usuários
* Gerenciamento de usuários
* Gerenciamento de permissões
* Tema claro e escuro
* Dashboard com dados em tempo real via WebSocket
* Cadastro de filiais
* Cadastro de almoxarifados
* Associação de usuários a almoxarifados
* Cadastro de produtos
* Cadastro de produtos únicos
* Associação de saldo de produtos a almoxarifados por filial
* Controle de estoque por almoxarifado e filial
* Inventário de estoque
* Envio de e-mails via fila com RabbitMQ
* Integração com serviço externo de arquivos como OperaFR

---

# Tecnologias utilizadas

## Front-end

* Next.js
* React
* Material UI
* Axios
* WebSocket Client
* Tema claro/escuro
* Layout responsivo

## Back-end

* Node.js
* Express.js
* API REST
* WebSocket
* JWT para autenticação
* Middlewares de autenticação, CORS e logs
* Arquitetura em camadas
* Prisma ORM

## Banco de dados

* PostgreSQL

## Serviços auxiliares

* RabbitMQ para fila de e-mails
* OperaFR para armazenamento e gerenciamento de arquivos
* Docker e Docker Compose para orquestração dos serviços

---

# Arquitetura adotada (Front-end)
* Baseada no próprio framework usado: Next.js
* Será usado page router, então todas as páginas navegáveis estarão dentro de 'src/pages'
* Componentes terão extensão `.jsx`
* Páginas e utilitários terão extensão `.js`

# Arquitetura adotada (Back-end)

* Em camadas, cada uma com sua responsabilidade
* Routes: arquivos que especifica as rotas da API Rest
* Controllers: arquivos que filtram dados de entrada e chamam services
* Services: arquivos que contém regra de negócio, lêem e escrevem no banco de dados
* Repositories (OPCIONAL): arquivos que contém consultas SQL personalizadas e complexas demais para o ORM comum
* Errors: arquivos que contém classes de erros personalizadas, sendo Error -> AppError -> TypeError
* Middlewares: arquivos que contém códigos a serem executados antes ou depois de uma requisição
* Utils: arquivos com funções puras e reutilizáveis por todo o back-end, sem acesso a banco, request, response ou regra de negócio

## Estrutura sugerida do back-end

`src/`

* `server.js`

### Middlewares

#### `auth.middleware.js`

Middleware responsável por autenticar o usuário da requisição.

O middleware deverá buscar o token em uma das seguintes origens:

* Header `Authorization`
* Cookie `token`

A prioridade de leitura deverá ser:

1. Header `Authorization`
2. Cookie `token`

O token recebido deverá ser consultado no banco de dados.

Para a autenticação ser considerada válida, o token deverá:

* existir no banco de dados
* ter sido criado há menos de 8 horas
* estar com `ativo` igual a `true`

Caso o token não seja encontrado, tenha sido criado há mais de 8 horas ou esteja com `ativo` igual a `false`, a autenticação não deverá ser realizada.

Em caso de falha na autenticação, a API deverá retornar:

* HTTP Status: `401 Unauthorized`
* Mensagem: `Autenticação não realizada`

Cada motivo de falha deverá ser registrado com `console.log`, para facilitar debug durante o desenvolvimento.

Exemplos de situações que deverão gerar log:

* token não informado
* token não encontrado no banco de dados
* token expirado
* token inativo
* erro inesperado durante autenticação

Em caso de autenticação válida, o middleware deverá buscar todos os dados da tabela `usuario`, com exceção da senha, e adicionar esses dados ao objeto `req`.

O usuário autenticado deverá ficar disponível em:

`req.user`

#### `cors.middleware.js`

Middleware reservado para configuração de CORS.

Por enquanto, ainda não será implementado.

#### `log.middleware.js`

Middleware global responsável por registrar logs de requisições HTTP da API.

O middleware deverá ser registrado antes das rotas para conseguir acompanhar todo o ciclo da requisição e deverá salvar o log apenas depois que a resposta terminar, usando o evento:

`res.on("finish", ...)`

O middleware deverá registrar os logs na tabela:

`log_api`

Cada requisição processada pela API deverá gerar um registro, incluindo rotas públicas e rotas autenticadas.

A rota `/health` não deverá gerar log em `log_api`, para evitar ruído de healthcheck.

Quando a requisição tiver usuário autenticado em `req.user`, o log deverá salvar:

`id_usuario = req.user.id`

Quando a requisição não tiver usuário autenticado, o log deverá salvar:

`id_usuario = null`

O middleware deverá capturar:

* método HTTP
* rota/path
* URL original
* status code final da resposta
* IP de origem
* user-agent
* referer
* params
* query
* body
* body da resposta, quando possível
* tempo total da resposta em milissegundos
* usuário autenticado, quando existir
* indicador de erro
* mensagem de erro retornada, quando existir

O body da resposta deverá ser capturado interceptando `res.json`, sem alterar o comportamento original da resposta.

O middleware não deverá registrar `stack_trace`.

Antes de persistir o body da requisição, o middleware deverá sanitizar dados sensíveis.

Campos sensíveis conhecidos:

* `password`
* `senha`

Payloads de upload, `multipart/form-data` ou conteúdo binário não deverão ser persistidos como conteúdo bruto.

Caso ocorra erro ao salvar o log no banco, o middleware não deverá quebrar a requisição nem alterar a resposta enviada ao cliente.

Falhas de persistência do log deverão ser registradas apenas com:

`console.error`

#### `error.middleware.js`

Middleware global responsável por centralizar o tratamento de erros da API.

As rotas deverão chamar os controllers utilizando um `asyncHandler`, para que erros lançados em funções assíncronas sejam encaminhados automaticamente para o middleware global de erro.

Fluxo esperado:

`route -> asyncHandler -> controller -> DTO -> service -> repository`

Caso qualquer camada lance um erro, ele deverá ser encaminhado para:

`middlewares/error.middleware.js`

Os erros específicos da aplicação deverão ficar em:

`src/errors/`

Cada classe de erro deverá possuir seu próprio código HTTP.

Erros previstos:

* `BadRequestError` -> `400 Bad Request`
* `UnauthorizedError` -> `401 Unauthorized`
* `ForbiddenError` -> `403 Forbidden`
* `NotFoundError` -> `404 Not Found`
* `ConflictError` -> `409 Conflict`
* `ValidationError` -> `422 Unprocessable Entity`
* `InternalServerError` -> `500 Internal Server Error`

O middleware global deverá identificar erros derivados de `AppError`.

Quando o erro for uma instância de `AppError`, deverá retornar o código HTTP e a mensagem definidos pela própria classe de erro.

Quando o erro não for uma instância de `AppError`, deverá ser tratado como erro inesperado.

Erros inesperados deverão retornar:

* HTTP Status: `500 Internal Server Error`
* Mensagem: `Erro interno do servidor`

O middleware global também deverá registrar erros inesperados com `console.error`, para facilitar debug e investigação.

### Routes

* Cada arquivo aqui deve chamar alguma função de controller
* Exemplos de rotas abaixo
* `routes/index.js` deve carregar as rotas do diretório `routes`, afim de ser importado apenas este arquivo e não todos os outros
* `routes/auth.routes.js` deve ter as rotas de autenticação, como login, logout, checar autenticação, esqueci minha senha, etc.
* `routes/usuarios.routes.js` CRUD de usuários
* `routes/permissoes.routes.js` CRUD de permissões de usuários
* `routes/produtos.routes.js` CRUD de produtos
* `routes/almoxarifados.routes.js` CRUD de almoxarifados
* `routes/filiais.routes.js` CRUD de filiais
* `routes/inventarios.routes.js` CRUD de inventários

### Controllers

* Cada controller deve chamar alguma função de service
* Controllers deverão usar DTOs antes de chamar services
* As funções não devem estar envelopadas em try catch, pois será usado um middleware global para lidar com os erros
* Exemplos de rotas abaixo
* `controllers/auth.controller.js`
* `controllers/usuarios.controller.js`
* `controllers/produtos.controller.js`
* `controllers/almoxarifados.controller.js`
* `controllers/filiais.controller.js`
* `controllers/inventarios.controller.js`

### DTOs

* DTOs serão responsáveis por validar, filtrar, normalizar e padronizar dados recebidos pela API
* DTOs devem ficar agrupados por entidade ou domínio dentro de `src/dtos`
* Exemplos de estrutura:
  * `src/dtos/auth/login.dto.js`
  * `src/dtos/usuario/criar-usuario.dto.js`
* DTOs não deverão conter regra de negócio
* DTOs deverão validar apenas estrutura e formato dos dados
* DTOs poderão:
  * validar tipos
  * validar campos obrigatórios
  * remover campos indevidos
  * normalizar strings
  * converter tipos simples
  * padronizar payloads
* DTOs não deverão:
  * acessar banco de dados
  * consultar repositories
  * conter SQL
  * conter regras de autorização
  * conter regra de negócio complexa

### Services

* Cada arquivo deve receber um payload do controller
* Services deverão assumir que os dados recebidos pelo controller já estão validados estruturalmente via DTO
* Cada arquivo pode exportar várias funções, sejam para serem usadas por outros services ou por um controller
* Não deve se preocupar com erros, mas pode retornar erros específicos (veja os tipos de erros específicos em `src/errors`)
* Use try catch apenas se for necessário usar rollback em algum momento
* Exemplos de rotas abaixo
* `services/auth.service.js`
* `services/usuarios.service.js`
* `services/produtos.service.js`
* `services/estoque.service.js`
* `services/inventarios.service.js`
* `services/email.service.js`

### Utils

* Cada arquivo em `src/utils` deve representar um utilitário reutilizável por múltiplas camadas do back-end
* Utils devem conter funções puras ou helpers determinísticos sempre que possível
* Utils não devem acessar banco de dados
* Utils não devem conhecer objetos de HTTP como `req`, `res`, cookies ou headers
* Utils não devem lançar erros de regra de negócio ou erros HTTP específicos, a menos que o próprio utilitário tenha sido definido para validação genérica
* Exemplos:
* `utils/cpf.js`
* `utils/email.js`
* `utils/date.js`

### Repositories

* Cada arquivo deve receber o mínimo de payload possível
* Cada arquivo deve conter apenas uma consulta SQL
* Cada arquivo não deve fazer checagem de condição com payload. Ex: "Se dado 'X' do payload for 'A' então fazer isso"
* Consultas SQL devem ser extremamente específicas
* Consultas SQL não devem fazer formatação pesada de dados no SELECT, a não ser que seja para fins de apresentação
* `repositories/usuarios.repository.js`
* `repositories/produtos.repository.js`
* `repositories/almoxarifados.repository.js`
* `repositories/filiais.repository.js`
* `repositories/inventarios.repository.js`

### Config

* `config/database.js` para conexão com o banco de dados via Prisma ORM
* `config/rabbitmq.js` para conexão com o banco de dados de fila rabbitmq
* `config/websocket.js` para conexões de websocket afim de simular eventos em tempo real

O front-end será separado do back-end e consumirá a API REST.

O back-end será responsável por:

* Regras de negócio
* Persistência de dados
* Autenticação
* Permissões
* WebSockets
* Comunicação com serviços externos

---

## Serviços previstos

### Frontend

Responsável pela interface web do sistema.

### Backend

Responsável por:

* API REST
* Autenticação
* Regras de negócio
* WebSocket

### Database

Banco PostgreSQL.

### RabbitMQ

Fila para envio assíncrono de e-mails.

### OperaFR

Serviço externo para gerenciamento de arquivos.

---

# Design Patterns utilizados

## Repository Pattern

Será usado para isolar o acesso ao banco de dados.

### Exemplos

* `produtos.repository.js`
* `usuarios.repository.js`
* `inventarios.repository.js`

### Motivo

Evitar que controllers e services executem SQL diretamente.

---

## Service Layer

Será usado para concentrar regras de negócio e manipulação de dados no banco de dados com transação

### Exemplos

* Validar se o usuário pode acessar determinado almoxarifado
* Verificar se produto único já possui número de série cadastrado
* Calcular diferença entre estoque esperado e estoque inventariado

### Motivo

Separar regra de negócio da camada HTTP.

---

## DTO

Será usado para padronizar entrada da API.

### Exemplos

* `dtos/auth/login.dto.js`
* `dtos/usuario/criar-usuario.dto.js`
* `dtos/produto/criar-produto.dto.js`
* `dtos/inventario/registrar-inventario.dto.js`

### Motivo

Evitar processamento de dados inválidos ou indevidos.

---

## Singleton

Será usado para:

* Conexão com banco de dados (espeficiamente no Websocket, outros lugares criarão uma conexão e soltarão após uso)
* WebSocket

### Motivo

Evitar múltiplas conexões desnecessárias.

---

## Observer

Será usado no WebSocket para notificar telas em tempo real.

### Exemplos

* Atualização de estoque
* Dashboard
* Inventário

### Motivo

Permitir atualização automática da interface sem recarregar a página.

---

# Módulos funcionais

## Autenticação

* Login
* Logout
* Proteção de rotas
* Token JWT
* Verificação de usuário autenticado

---

## Usuários

* Cadastro de usuários
* Listagem de usuários
* Edição de usuários
* Inativação de usuários
* Associação de usuários a almoxarifados
* Controle de permissões

---

## Permissões

* Perfil administrador
* Perfil operador
* Perfil visualizador
* Controle de acesso por almoxarifado
* Controle de ações:

  * cadastrar
  * editar
  * excluir
  * visualizar
  * inventariar

---

## Filiais

* Cadastro de filiais
* Edição de filiais
* Listagem de filiais

---

## Almoxarifados

* Cadastro de almoxarifados
* Associação com usuários
* Visualização de estoque por almoxarifado

---

## Produtos

* Cadastro de produtos
* Classificação entre produto comum e produto único
* Unidade de medida
* Estoque mínimo
* Estoque atual
* Associação com almoxarifado e filial

---

## Produtos únicos

Produtos controlados individualmente.

### Exemplos

* Roteador com número de série
* Equipamento com MAC address
* ONU
* Switch
* Notebook

### Campos possíveis

* Produto base
* Número de série
* MAC
* Status
* Almoxarifado atual
* Filial atual

---

## Produtos comuns

Produtos controlados por quantidade.

### Exemplos

* Cabo
* Parafuso
* Conector
* Abraçadeira
* Etiqueta

### Campos possíveis

* Produto
* Unidade de medida
* Quantidade
* Almoxarifado
* Filial

---

## Inventário

O inventário permitirá que um usuário confira o estoque físico de um almoxarifado.

### Funcionalidades

* Criar inventário
* Selecionar almoxarifado
* Listar produtos esperados
* Informar quantidade encontrada
* Informar produtos únicos encontrados
* Registrar divergências
* Finalizar inventário
* Gerar histórico

Cada item inventariado também possuirá vínculo com uma filial.

---

# Dashboard em tempo real

A dashboard poderá exibir:

* Total de produtos cadastrados
* Total de itens em estoque
* Produtos abaixo do estoque mínimo
* Últimas movimentações
* Inventários em andamento
* Divergências recentes

As atualizações poderão ser enviadas em tempo real via WebSocket.

---

# API REST

A API será organizada por domínio.

## Rotas previstas

### Auth

* `/auth/login`
* `/auth/me`

### Usuários

* `/usuarios`
* `/usuarios/:id`
* `/usuarios/:id/permissoes`

### Filiais

* `/filiais`
* `/filiais/:id`

### Almoxarifados

* `/almoxarifados`
* `/almoxarifados/:id`
* `/almoxarifados/:id/usuarios`

### Produtos

* `/produtos`
* `/produtos/:id`
* `/produtos-unicos`
* `/produtos-unicos/:id`

### Estoque

* `/estoque`
* `/estoque/movimentacoes`

### Inventários

* `/inventarios`
* `/inventarios/:id`
* `/inventarios/:id/finalizar`

## Requisitos da API

* Retorno em JSON
* Validação de dados
* Tratamento de erros
* CRUD completo nos principais módulos
* Organização por rotas, controllers, services e repositories

---

# Banco de dados

## Migrations

* As migrations são realizadas manualmente
* No back-end, há um diretório `database`, dentro dele temos:
    * Diretório `migrations` onde cada arquivo dentro é um script DDL na linguagem SQL
    * Arquivo `migrate.js` que funciona baseado nas seguintes decisões:
        1. Existe tabela `migrations`? Se não, criar
        2. Para cada arquivo dentro do diretório `migrations`, existem na tabela `migrations`? Se não, execute ele e registre na tabela `migrations`
* Após execução da migração, é necessário executar:
    1. `npx prisma db pull` que verifica o DDL do banco de dados e escreva em `back/prisma/schema.prisma`
    2. `npx prisma generate` que faz com que a sessão atual do prisma leia o `back/prisma/schema.prisma`
* Cada um dos 3 passos anteriores existem em formato de script em `back/package.json`
* Existe um script em `back/package.json` que executa os 3 passos anteriores, é o `npm run db:sync`
* Isso tudo permite:
    1. Versionamento com `.sql` e não na sintaxe do `schema.prisma`
    2. Uso de funções ORM como `db.usuario.create`

## ORM & Schema

* Se as migrations foram executadas corretamente, o schema do banco de dados existe em `back/schema.prisma`
* Isso significa que é possível usar funções de ORM como `db.usuario.create`

## Relacionamentos principais

* Uma filial possui vários produtos em estoque
* Um almoxarifado pode armazenar produtos de diferentes filiais
* Cada item de estoque pertence simultaneamente a:
  * um produto
  * um almoxarifado
  * uma filial
* Um usuário pode estar associado a vários almoxarifados
* Um almoxarifado pode ter vários usuários
* Um produto único pertence a um produto base
* Um inventário pertence a um almoxarifado
* Um inventário possui vários itens
* Um usuário pode criar ou executar inventários

---

# Diferenciais do projeto

* WebSocket para atualização em tempo real
* RabbitMQ para envio assíncrono de e-mails
* Gerenciamento de anexos
* Tema claro e escuro
* Interface responsiva
* Controle de produtos únicos por número de série e MAC
* Inventário com registro de divergências
* Controle de estoque separado por filial

---

# Entregáveis

O projeto deverá entregar:

* Código-fonte no GitHub ou GitLab
* Documento técnico
* Scripts de criação do banco
* Dados de teste
* Prints da aplicação
* Diagrama simplificado da arquitetura
* Explicação da API
* Explicação dos Design Patterns
* Apresentação final demonstrando:

  * funcionamento
  * arquitetura
  * padrões aplicados
  * organização do código
