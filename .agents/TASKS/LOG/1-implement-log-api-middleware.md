# Implementação de logs de requisições da API

## Objetivo

Implementar o log de requisições da API no back-end do projeto Stocky.

---

# Contexto

* A migration da tabela `log_api` já foi criada.
* Não criar migration nova.
* O projeto usa:

  * Node.js
  * Express.js
  * Prisma ORM
  * arquitetura em camadas
* O source of truth já prevê:

  * `src/middlewares/log.middleware.js`
* Existe middleware de autenticação que, quando a autenticação é válida, adiciona o usuário autenticado em:

  * `req.user`
* O objetivo é registrar uma linha em `log_api` para cada requisição HTTP processada pela API.

---

# Tarefas

## 1. Implementar middleware de log

Criar/implementar o arquivo:

`src/middlewares/log.middleware.js`

---

## 2. Registrar middleware globalmente

Integrar o middleware no fluxo principal do Express.

Provavelmente em:

* `src/server.js`
* ou no arquivo onde os middlewares globais são registrados.

---

## 3. Dados que devem ser registrados

O middleware deve registrar:

| Campo              | Origem                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| `data_hora`        | não precisa enviar manualmente se o banco já usar default                     |
| `metodo`           | `req.method`                                                                  |
| `rota`             | rota/path da requisição                                                       |
| `url_original`     | `req.originalUrl`                                                             |
| `status_code`      | `res.statusCode`                                                              |
| `ip`               | IP de origem da requisição                                                    |
| `user_agent`       | header `user-agent`                                                           |
| `referer`          | header `referer`                                                              |
| `params`           | `req.params`                                                                  |
| `query`            | `req.query`                                                                   |
| `body`             | `req.body`                                                                    |
| `response_body`    | corpo retornado pela API quando possível                                      |
| `response_time_ms` | diferença em milissegundos entre entrada da request e finalização da response |
| `id_usuario`       | `req.user.id` quando existir, senão `null`                                    |
| `erro`             | `true` quando `status_code >= 400`, senão `false`                             |
| `erro_mensagem`    | mensagem retornada no body quando for erro, se existir                        |

---

# Regras importantes

* O middleware não pode quebrar a requisição caso falhe ao salvar o log.
* Se houver erro ao registrar o log, usar apenas:

  * `console.error`
* O log deve ser salvo depois que a resposta terminar, para capturar:

  * status final
  * tempo total
* Usar evento adequado do Express/Node:

  * `res.on('finish', ...)`
* Capturar `response_body` interceptando `res.json`, mas sem alterar o comportamento original da resposta.
* Não registrar:

  * `stack_trace`
* Não criar migration.
* Não alterar a tabela `log_api`, a menos que seja estritamente necessário para compatibilidade com Prisma.
* Se o Prisma ainda não tiver o model atualizado:

  * verificar se é necessário rodar scripts existentes do projeto, como:

    * `npm run db:sync`
  * não inventar novo fluxo de migration.
* O middleware deve ser global, mas precisa respeitar rotas públicas:

  * quando não houver `req.user`, salvar:

    * `id_usuario = null`
* Se o middleware de autenticação atual for obrigatório e bloquear rotas públicas:

  * não transformar ele em dependência obrigatória do log.
  * O log deve funcionar com ou sem usuário autenticado.

---

# Sanitização de dados sensíveis

Antes de registrar o `body` no banco de dados:

* remover a senha enviada na rota de login
* remover a senha enviada na criação de usuário

A sanitização deve ocorrer antes da persistência no banco.

Exemplos de campos sensíveis:

* `password`
* `senha`

Os valores devem ser removidos ou mascarados antes do insert.

---

# Cuidados

* Não salvar body de uploads grandes ou binários.
* Se houver:

  * `multipart/form-data`
  * upload de arquivos
  * payload binário
  * evitar persistir conteúdo bruto.
* Não gerar loop infinito caso rota de healthcheck ou rota interna seja chamada com frequência.
* Se existir rota:

  * `/`
  * `/health`
  * avaliar se faz sentido ignorar logs dessas rotas.
* Preferencialmente implementar uma lista simples de rotas ignoradas apenas se fizer sentido no projeto.
* Não usar repository/service para este caso se o padrão atual do projeto ainda não tiver camada pronta para logs.
* Como é middleware técnico e simples:

  * pode usar Prisma diretamente no middleware
  * desde que siga o padrão atual do projeto.
* Preservar estilo atual do projeto:

  * imports
  * exports
  * CommonJS ou ESModules
  * convenções existentes

---

# Atualização do source of truth

Atualizar o source of truth do projeto de acordo com a nova feature implementada.

Adicionar a documentação em:

* `Estrutura do back-end`
* seção:

  * `Middlewares`

Documentar:

* objetivo do middleware
* comportamento
* captura de request/response
* sanitização de dados sensíveis
* persistência na tabela `log_api`
* funcionamento com ou sem autenticação

---

# Critérios de aceite

* Toda requisição à API gera registro em `log_api`.
* Requisições autenticadas salvam `id_usuario`.
* Requisições não autenticadas salvam:

  * `id_usuario = null`
* Status code salvo é o status final real da resposta.
* Tempo de resposta é salvo em milissegundos.
* Erros `4xx` e `5xx` ficam com:

  * `erro = true`
* Falha ao salvar log não altera a resposta enviada ao cliente.
* Código não cria migration nova.
* Código não altera regras de autenticação existentes sem necessidade.
