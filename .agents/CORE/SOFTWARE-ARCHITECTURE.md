# Arquitetura de Software

## Visão geral

O edudict é separado em front-end web e back-end API REST.

O back-end é responsável por:

* Regras de negócio.
* Persistência de dados.
* Autenticação.
* WebSockets.
* Comunicação com serviços externos.
* Chamada à API externa que executa o modelo treinado.
* Integração com o serviço de agente LLM.

O back-end não carrega nem executa o modelo treinado localmente. A predição é realizada por uma API externa, chamada pela camada de service.

## Arquitetura do front-end

* Baseada em Next.js.
* Usa Page Router.
* Páginas navegáveis ficam dentro de `front/src/pages`.
* Componentes têm extensão `.jsx`.
* Páginas e utilitários têm extensão `.js`.
* Material UI é a biblioteca principal de interface.
* O front-end consome a API REST do back-end.

### Boas práticas

* useState: evite ficar usando muitos, uma quantidade alta de estados pode indicar que talvez essa tela não deva ter tantas coisas, me sinalize nisso quando eu pedir para você alterar uma tela
* useEffect: evite criar loop de dependências
* Não será usado SSR
* Evite criar variáveis booleanas intermediárias (canEdit, canDelete, canSave, etc.) quando elas forem utilizadas apenas uma única vez no JSX. Nestes casos, prefira utilizar a condição diretamente na propriedade ou renderização correspondente. Extraia para uma variável apenas quando a regra possuir complexidade relevante, for reutilizada em múltiplos locais ou melhorar significativamente a legibilidade.
* Ao realizar importações do MUI material, siga a seguinte diretriz:
  - NÃO FAZER:
  ``` js
  import { Box, Button, Stack } from '@mui/material';
  ```
  - FAZER:
  ``` js
  import Box from '@mui/material/Box';
  import Button from '@mui/material/Button';
  import Stack from '@mui/material/Stack';
  ```

### Contexts

* Arquivos de contextos que fornecem estados usados em toda a aplicação.
* Ficam em `src/contexts`

#### Contexto de tema

* Nome do arquivo: `ThemeContext.js`
* Padroniza as cores do sistema todo baseado no modo claro/escuro
* Tem como objetivo evitar ao máximo estilização específica como o prop `sx` nos componentes
* O MUI Material oferece estrutura para fazer essa padronização
* Fornece o padrão de cores como primary, secondary, success, danger, warning

#### Contexto de autenticação

* Nome do arquivo: `AuthContext.js`
* Fornece os seguintes estados:
  1. `isAuthLoading` tipo `boolean`: indica se no momento atual a autenticação está sendo verificada
  2. `isAuthenticated` tipo `boolean`: indica se o usuário atual está autenticado ou não
  3. `user` tipo [object Object]: dados do usuário
  4. `login` tipo `function`: função a ser chamada quando a requisição API de login for realizada com sucesso, esta checa novamente a autenticação e muda o estado `isAuthenticated` em caso de sucesso 
  5. `logout` tipo `function`: função a ser chamada quando a tela de logout for acessada, ela chama a rota API de logout e, em caso de sucesso, muda o estado `isAuthenticated`

### Utils

* Ficam em `src/utils`
* Arquivos que contém funções utilitárias (também chamados de `helpers` no inglês)
* Cada arquivo é uma função utilitária diferente que exporta somente uma função
* Todo e qualquer tipo de formatação, validação ou estrutura que for reutilizável deve ir para um arquivo utilitário
* Evite ao máximo criar várias funções minúsculas internas no arquivo da função utilitária
* Use `early return` e desconfie 100% do dado que foi enviado, ou seja, valide o que não faz sentido e retorne cedo
* Em caso de funções de formatação para visualização, busque retornar strings vazias caso não dê para continuar por razões de argumentos inválidos
* Não use try/catch, deixe o circo pegar fogo

### Components

* Ficam em `src/components`
* Arquivos que contém componentes reutilizáveis ao longo de toda a aplicação
* Todos os arquivos aqui terão extensão `.jsx`
* Neste diretório ficarão apenas componentes que não são parte de um contexto específico
* Se foi pedido para criar um componente e este componente tem um contexto de entidade, deve ficar dentro do diretório daquela página. Ex: tela de usuários pode ser um diretório `usuarios` com arquivo `index.js` e componente `usuarios.jsx`
* Exemplos de componentes:
  1. `Navbar.jsx`: barra de navegação do sistema
  2. `Footer.jsx`: rodapé do sistema
  3. `NotFound.jsx`: página que aparecerá caso a URL direcione o usuário para uma página que não existe

## Arquitetura do back-end

O back-end usa arquitetura em camadas, cada uma com sua responsabilidade.

Fluxo esperado:

`route -> asyncHandler -> controller -> DTO -> service -> repository/ORM`

### Routes

* Cada arquivo de rota deve chamar uma função de controller.
* `routes/index.js` deve carregar as rotas do diretório `routes`.
* Isso permite importar apenas o agregador de rotas no servidor.

Exemplos previstos:

* `routes/auth.routes.js`: rotas de autenticação, como login, logout, checar autenticação e recuperação de senha.
* `routes/usuarios.routes.js`: CRUD de usuários.
* `routes/predicoes.routes.js`: criação e histórico de predições.
* `routes/chats.routes.js`: criação e histórico de chats.
* `routes/mensagens.routes.js`: envio e listagem de mensagens.

### Controllers

* Cada controller deve chamar uma função de service.
* Controllers devem usar DTOs antes de chamar services.
* Controllers não devem usar `try/catch` quando o erro puder ser tratado pelo middleware global.

Exemplos previstos:

* `controllers/auth.controller.js`.
* `controllers/usuarios.controller.js`.
* `controllers/predicoes.controller.js`.
* `controllers/chats.controller.js`.
* `controllers/mensagens.controller.js`.

### DTOs

DTOs são responsáveis por validar, filtrar, normalizar e padronizar dados recebidos pela API.

DTOs devem ficar agrupados por entidade ou domínio dentro de `src/dtos`.

Exemplos:

* `src/dtos/auth/login.dto.js`.
* `src/dtos/usuario/criar-usuario.dto.js`.
* `src/dtos/predicao/criar-predicao.dto.js`.
* `src/dtos/chat/criar-chat.dto.js`.
* `src/dtos/mensagem/criar-mensagem.dto.js`.
* `src/dtos/log-app/criar-log.dto.js`.

DTOs podem:

* validar tipos.
* validar campos obrigatórios.
* remover campos indevidos.
* normalizar strings.
* converter tipos simples.
* padronizar payloads.

DTOs não devem:

* acessar banco de dados.
* consultar repositories.
* conter SQL.
* conter regras de autorização.
* conter regra de negócio complexa.

### Services

* Cada service deve receber payload do controller.
* Services devem assumir que os dados recebidos já foram validados estruturalmente via DTO.
* Services podem exportar várias funções.
* Services podem retornar erros específicos definidos em `src/errors`.
* Usar `try/catch` apenas quando for necessário controle explícito de rollback.

Exemplos previstos:

* `services/auth.service.js`.
* `services/log-app.service.js`.
* `services/usuarios.service.js`.
* `services/predicoes.service.js`.
* `services/api-predicao.service.js`.
* `services/chats.service.js`.
* `services/mensagens.service.js`.
* `services/agente.service.js`.

Services podem se comunicar com integrações externas, desde que mantenham as responsabilidades separadas. O service de predições coordena a regra da aplicação, enquanto o client ou service de integração chama a API externa. Da mesma forma, o service do agente controla o contexto permitido e chama o serviço LLM.

### Repositories

Repositories são opcionais e devem ser usados para consultas SQL personalizadas ou complexas demais para o ORM comum.

Regras:

* Cada arquivo deve receber o mínimo de payload possível.
* Cada arquivo deve conter apenas uma consulta SQL.
* Não deve fazer checagem condicional pesada com payload.
* Consultas SQL devem ser extremamente específicas.
* Consultas SQL não devem fazer formatação pesada no `SELECT`, exceto para fins de apresentação.

Exemplos previstos:

* `repositories/usuarios.repository.js`.
* `repositories/predicoes.repository.js`.
* `repositories/chats.repository.js`.
* `repositories/mensagens.repository.js`.
* `repositories/tokens-autenticacao.repository.js`.

### Middlewares

Middlewares contêm códigos executados antes ou depois de uma requisição.

#### `auth.middleware.js`

Middleware responsável por autenticar o usuário da requisição.

O middleware deve buscar o token em uma das seguintes origens:

* Header `Authorization`.
* Cookie `token`.

Prioridade de leitura:

1. Header `Authorization`.
2. Cookie `token`.

O token recebido deve ser consultado no banco de dados.

Para a autenticação ser considerada válida, o token deve:

* existir no banco de dados.
* ter sido criado há menos de 8 horas.
* estar com `ativo` igual a `true`.

Caso o token não seja encontrado, tenha sido criado há mais de 8 horas ou esteja com `ativo` igual a `false`, a autenticação não deve ser realizada.

Em caso de falha na autenticação, a API deve retornar:

* HTTP Status: `401 Unauthorized`.
* Mensagem: `Autenticação não realizada`.

Cada motivo de falha deve ser registrado com `console.log` para facilitar debug durante o desenvolvimento.

Exemplos de situações que devem gerar log:

* token não informado.
* token não encontrado no banco de dados.
* token expirado.
* token inativo.
* erro inesperado durante autenticação.

Em caso de autenticação válida, o middleware deve buscar todos os dados da tabela `usuario`, com exceção da senha, e adicionar esses dados ao objeto `req`.

O usuário autenticado deve ficar disponível em:

`req.user`

#### `cors.middleware.js`

Middleware reservado para configuração de CORS.

Por enquanto, ainda não será implementado.

#### `log.middleware.js`

Middleware global responsável por registrar logs de requisições HTTP da API.

O middleware deve ser registrado antes das rotas para acompanhar todo o ciclo da requisição e salvar o log apenas depois que a resposta terminar, usando:

`res.on("finish", ...)`

O middleware deve registrar os logs na tabela `log_api`.

Cada requisição processada pela API deve gerar um registro, incluindo rotas públicas e rotas autenticadas.

A rota `/health` não deve gerar log em `log_api`, para evitar ruído de healthcheck.

Quando a requisição tiver usuário autenticado em `req.user`, o log deve salvar:

`id_usuario = req.user.id`

Quando a requisição não tiver usuário autenticado, o log deve salvar:

`id_usuario = null`

O middleware deve capturar:

* método HTTP.
* rota/path.
* URL original.
* status code final da resposta.
* IP de origem.
* user-agent.
* referer.
* params.
* query.
* body.
* body da resposta, quando possível.
* tempo total da resposta em milissegundos.
* usuário autenticado, quando existir.
* indicador de erro.
* mensagem de erro retornada, quando existir.

O body da resposta deve ser capturado interceptando `res.json`, sem alterar o comportamento original da resposta.

O middleware não deve registrar `stack_trace`.

Antes de persistir o body da requisição, o middleware deve sanitizar dados sensíveis.

Campos sensíveis conhecidos:

* `password`.
* `senha`.

Payloads de upload, `multipart/form-data` ou conteúdo binário não devem ser persistidos como conteúdo bruto.

Caso ocorra erro ao salvar o log no banco, o middleware não deve quebrar a requisição nem alterar a resposta enviada ao cliente.

Falhas de persistência do log devem ser registradas apenas com `console.error`.

### Errors

Erros específicos da aplicação devem ficar em `src/errors`.

Cada classe de erro deve possuir seu próprio código HTTP.

Erros previstos:

* `BadRequestError` -> `400 Bad Request`.
* `UnauthorizedError` -> `401 Unauthorized`.
* `ForbiddenError` -> `403 Forbidden`.
* `NotFoundError` -> `404 Not Found`.
* `ConflictError` -> `409 Conflict`.
* `ValidationError` -> `422 Unprocessable Entity`.
* `InternalServerError` -> `500 Internal Server Error`.

### Middleware global de erro

`error.middleware.js` centraliza o tratamento de erros da API.

As rotas devem chamar controllers utilizando `asyncHandler`, para que erros lançados em funções assíncronas sejam encaminhados automaticamente para o middleware global de erro.

Caso qualquer camada lance um erro, ele deve ser encaminhado para:

`middlewares/error.middleware.js`

O middleware global deve identificar erros derivados de `AppError`.

Quando o erro for uma instância de `AppError`, deve retornar o código HTTP e a mensagem definidos pela própria classe de erro.

Quando o erro não for uma instância de `AppError`, deve ser tratado como erro inesperado.

Erros inesperados devem retornar:

* HTTP Status: `500 Internal Server Error`.
* Mensagem: `Erro interno do servidor`.

O middleware global também deve registrar erros inesperados com `console.error`.

### Utils

Cada arquivo em `src/utils` deve representar um utilitário reutilizável por múltiplas camadas do back-end.

Utils devem conter funções puras ou helpers determinísticos sempre que possível.

Utils não devem:

* acessar banco de dados.
* conhecer objetos HTTP como `req`, `res`, cookies ou headers.
* lançar erros de regra de negócio ou erros HTTP específicos, a menos que o próprio utilitário tenha sido definido para validação genérica.

Exemplos:

* `utils/cpf.js`.
* `utils/email.js`.
* `utils/date.js`.

### Config

Arquivos previstos:

* `config/database.js` para conexão com o banco de dados via Prisma ORM.
* `config/rabbitmq.js` para conexão com RabbitMQ.
* `config/websocket.js` para conexões WebSocket.
* Configuração do client da API externa de predição.
* Configuração do client do serviço de agente LLM.

Clients compartilhados e reutilizáveis para integrações externas podem usar Singleton quando isso evitar instâncias ou conexões desnecessárias.

## `log_app`

Tabela responsável por rastrear alterações de registros a nível de banco de dados feitas pela aplicação.

O `log_app` deve registrar a alteração persistida no registro afetado usando:

* `tabela`.
* `id_tabela`.
* `operacao`.
* `antes`.
* `depois`.

O `log_app` não deve registrar resultado de operação, validação de regra de negócio, sucesso/falha de fluxo, motivo de rejeição, status HTTP ou qualquer outro contexto que não seja a alteração do registro persistido.

A separação esperada é:

* `log_api`: registra contexto HTTP da requisição e resposta.
* `log_app`: registra alterações em registros persistidos no banco de dados.

O `log_app` não deve registrar contexto HTTP, como IP, user-agent, rota, método, status code, body da requisição ou body da resposta. Esses dados pertencem ao `log_api`.

Todo service que fizer operação de escrita no banco deve registrar um `log_app` sobre o registro que foi alterado.

O log deve refletir a tabela realmente alterada, não necessariamente a entidade principal do service.

No caso de login e logout, o registro alterado é o token:

* no login, o `log_app` deve registrar a criação do token, com `antes = null` e `depois` contendo o registro de `token` criado.
* no logout, o `log_app` deve registrar a atualização do token, com `antes` contendo o registro de `token` antes da alteração e `depois` contendo o registro de `token` com `ativo = false`.

Operações permitidas em `log_app`:

* `INSERT`.
* `UPDATE`.
* `DELETE`.
* `LOGIN`.
* `LOGOUT`.

O DTO de criação de log deve ficar em:

`src/dtos/log-app/criar-log.dto.js`

O service responsável por persistir logs de aplicação deve ficar em:

`src/services/log-app.service.js`

A função principal do service deve se chamar:

`criarLog`

A função `criarLog` deve receber como primeiro parâmetro o client/conexão de banco que será utilizado para persistir o log, como `db` ou `tx`.

Exemplo:

`criarLog(tx, payload)`

Quando a operação principal estiver dentro de uma transação, o `log_app` deve ser gravado usando o mesmo `tx`.

Operações de escrita que gerem `log_app` devem começar a transação antes das leituras relevantes do fluxo, para garantir isolamento entre o dado lido, a alteração feita e o log gravado.

Campos sensíveis conhecidos, como `password` e `senha`, devem ser removidos dos dados salvos em `antes` e `depois` usando a mesma estratégia de sanitização do `log_api`.

## API REST

A API será organizada por domínio.

### Rotas previstas

* O prefixo da rota é o nome do arquivo, ex: rotas dentro de auth.routes.js serão acessíveis por `/auth`
* Leia `back/src/routes/index.js` para entender a linha anterior
* Não usar `req.params`
* Em rotas `GET` e `DELETE`, usar `req.query`
* Em rotas `POST` e `PUT`, usar `req.body`

#### Auth

* POST: `/auth/login`.
* POST: `/auth/logout`.

#### Usuários

* POST: `/usuarios`: criar usuário
* PUT: `/usuarios`: editar usuário
* GET: `/usuarios`: listar usuários

#### Predições

* POST: `/predicoes`: validar os dados, chamar a API externa, persistir e retornar a predição
* GET: `/predicoes`: listar o histórico de predições do usuário ou sessão visitante

#### Chats

* POST: `/chats`: criar um chat, opcionalmente vinculado a uma predição
* GET: `/chats`: listar o histórico de chats do usuário ou sessão visitante

#### Mensagens

* GET: `/mensagens`: listar as mensagens de um chat
* POST: `/mensagens`: persistir a mensagem do usuário, chamar o agente e persistir a resposta

As rotas disponíveis para visitantes devem receber o `guest_session_id` enviado pelo front-end. Esse identificador associa predições, chats e mensagens à sessão visitante, mas não autentica o usuário.

### Requisitos da API

* Retorno em JSON.
* Validação de dados.
* Tratamento de erros.
* Controle de acesso aos dados do usuário ou da sessão visitante.
* Tratamento de falhas nas integrações externas.
* Organização por rotas, controllers, services e repositories.

## Design Patterns utilizados

### Repository Pattern

Será usado para isolar o acesso ao banco de dados.

Exemplos:

* `usuarios.repository.js`.
* `predicoes.repository.js`.
* `chats.repository.js`.
* `mensagens.repository.js`.
* `tokens-autenticacao.repository.js`.

Motivo:

* Evitar que controllers e services executem SQL diretamente.
* Deve ser usado somente e apenas quando um SQL complexo for necessário.

### Service Layer

Será usado para concentrar regras de negócio e manipulação de dados no banco de dados com transação.

Exemplos:

* Validar e criar uma predição.
* Chamar a API externa de predição.
* Persistir e retornar o resultado bruto.
* Criar um chat a partir de uma predição.
* Enviar mensagem ao agente e persistir a resposta.
* Garantir que usuário ou sessão visitante só acesse seus próprios dados.
* Aplicar a restrição de escopo do agente.

Motivo:

* Separar regra de negócio da camada HTTP.

Regras:
* Funções utilitárias internas devem poder receber um objeto de transação, para evitar problemas de isolamento
* Toda função de service que alterar algo no BD deve registrar os logs em `log_app`

### DTO

Será usado para padronizar entrada da API.

Exemplos:

* `dtos/auth/login.dto.js`.
* `dtos/usuario/criar-usuario.dto.js`.
* `dtos/usuario/editar-usuario.dto.js`.
* `dtos/predicao/criar-predicao.dto.js`.
* `dtos/chat/criar-chat.dto.js`.
* `dtos/mensagem/criar-mensagem.dto.js`.

Motivo:

* Evitar processamento de dados inválidos ou indevidos.

Regras:
* Evitar duplicar funções de verificação
* Caso a mesma verificação precise ser feita em mais de um arquivo dto, colocar em `back/src/utils` 

### Singleton

Será usado para:

* Conexão com banco de dados, especialmente no WebSocket.
* WebSocket.
* Clients reutilizáveis da API externa de predição e do serviço de agente, quando aplicável.

Motivo:

* Evitar múltiplas conexões desnecessárias.

### Observer

Será usado no WebSocket para notificar telas em tempo real.

Exemplos:

* Atualização do histórico de predições.
* Atualização de chats e mensagens.
* Notificações para o usuário.

Motivo:

* Permitir atualização automática da interface sem recarregar a página.

## Relacionamentos principais

* Um usuário autenticado pode ter zero ou vários tokens de autenticação.
* Um token de autenticação pertence a apenas um usuário autenticado.
* Um usuário ou sessão visitante pode ter zero ou várias predições.
* Uma predição pertence a apenas um usuário ou sessão visitante.
* Um usuário ou sessão visitante pode ter zero ou vários chats.
* Um chat pertence a apenas um usuário ou sessão visitante.
* Uma predição pode ter zero ou vários chats.
* Um chat pode estar vinculado a uma predição.
* Um chat pode ter uma ou várias mensagens.
* Uma mensagem pertence a apenas um chat.

Resumo:

```txt
Usuário/Sessão visitante 1:N Predição
Usuário/Sessão visitante 1:N Chat
Predição 0:N Chat
Chat 1:N Mensagem
Usuário autenticado 1:N Token de autenticação
```

## Fluxos do novo domínio

### Geração de predição

1. O front-end identifica o usuário autenticado ou gera e envia um `guest_session_id`.
2. O controller recebe os dados e usa o DTO de criação de predição.
3. O service de predições chama o service ou client da API externa.
4. A API externa executa o modelo treinado e retorna o resultado bruto.
5. O service persiste a predição e o respectivo `log_app` na mesma transação.
6. O controller retorna o resultado bruto ao front-end.

O agente não participa desse fluxo.

### Criação de chat e interpretação

1. Depois de visualizar o resultado bruto, o usuário solicita a criação de um chat.
2. O service valida se a predição pertence ao usuário ou à sessão visitante.
3. O chat é persistido e vinculado à predição.
4. Ao receber uma mensagem, o service do agente limita o contexto aos dados permitidos.
5. O serviço LLM gera uma resposta.
6. As mensagens do usuário e do agente são persistidas.

### Restrição de escopo do agente

O agente só pode responder sobre o contexto de treinamento e modelagem fornecido ao sistema, o resultado bruto da predição, sua explicação, as variáveis usadas pelo modelo e as funcionalidades do edudict.

Assuntos fora desse domínio devem receber uma recusa educada e objetiva. Essa regra pertence à camada de service e deve ser aplicada antes e durante a composição do contexto enviado ao serviço LLM.
