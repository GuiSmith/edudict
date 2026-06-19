# Tarefa: Atualizar `.agents/CORE` para o novo produto de IA

## Contexto

Os arquivos `.md` dentro de `.agents/CORE` ainda estão parcialmente ou totalmente orientados ao produto antigo: um sistema de estoque.

O projeto atual mudou para uma aplicação web de IA, reaproveitando a mesma base arquitetural já definida.

O novo produto é um sistema web onde o usuário informa dados, recebe uma predição bruta gerada por uma API externa que contém o modelo treinado e, opcionalmente, cria um chat a partir dessa predição para que um agente inteligente interprete o resultado.

## Arquivos envolvidos

Revise e atualize todos os arquivos dentro de `.agents/CORE`, especialmente:

* `PROJECT-CONTEXT.md`
* `APPLICATION-SCOPE.md`
* `SOFTWARE-ARCHITECTURE.md`

## Diretriz principal

Não altere a arquitetura do projeto.

A arquitetura atual deve ser preservada.

O projeto continua tendo:

* front-end web;
* back-end API REST;
* banco de dados;
* arquitetura em camadas;
* rotas;
* controllers;
* DTOs;
* services;
* repositories quando necessário;
* autenticação;
* logs;
* tratamento global de erros;
* integração com serviços externos.

A mudança principal é de domínio/produto, não de arquitetura.

## O que provavelmente muda pouco

### `PROJECT-CONTEXT.md`

Este arquivo provavelmente muda pouco.

Atualize apenas o que ainda estiver explicitamente preso ao sistema de estoque, como:

* tema escolhido;
* nome/objetivo da solução;
* descrição do produto;
* possíveis referências literais a estoque.

Preserve o contexto acadêmico, disciplina, professor, prazos, critérios, entregáveis e exigências de arquitetura/design patterns.

### `SOFTWARE-ARCHITECTURE.md`

Este arquivo também deve mudar pouco.

Preserve as decisões arquiteturais existentes.

Altere apenas exemplos literais que ainda estejam ligados ao domínio antigo, como:

* nomes de rotas;
* nomes de controllers;
* nomes de services;
* nomes de DTOs;
* exemplos de repositories;
* exemplos de regras de negócio;
* exemplos de WebSocket ou Observer, se estiverem falando de estoque/inventário/produtos.

Não reformule a arquitetura sem necessidade.

A única adaptação relevante é deixar claro que alguns services podem se comunicar com serviços externos, como:

* API externa de predição;
* serviço/agente LLM;
* outros serviços auxiliares.

Isso não muda a arquitetura, pois comunicação externa por service/adapter já é compatível com o desenho atual.

### `APPLICATION-SCOPE.md`

Este arquivo deve mudar bastante.

Ele deve deixar de descrever um sistema de estoque e passar a descrever o sistema de IA.

Remova ou substitua referências a:

* estoque;
* produto;
* produto único;
* filial;
* almoxarifado;
* inventário;
* movimentação;
* saldo;
* fornecedor;
* entrada/saída de estoque;
* MAC address;
* número de série de equipamento.

## Novo produto

O sistema deve ser descrito como uma aplicação web de IA preditiva com agente inteligente.

Fluxo principal:

1. Usuário acessa o sistema.
2. Usuário pode estar autenticado ou não.
3. Usuário não autenticado usa um `guest_session_id`.
4. O `guest_session_id` é gerado no front-end.
5. O `guest_session_id` é salvo no `localStorage`.
6. O `guest_session_id` é enviado nas requisições para o back-end.
7. Usuário informa os dados necessários para gerar uma predição.
8. Back-end valida os dados recebidos.
9. Back-end chama uma API externa de predição, onde está o modelo treinado.
10. A API externa retorna o resultado da predição.
11. O back-end persiste a predição.
12. O back-end retorna ao front-end o resultado bruto da predição.
13. No front-end, o usuário visualiza o resultado bruto.
14. No front-end, existe um botão para criar um chat a partir daquela predição.
15. Ao criar o chat, o agente recebe o contexto da predição e pode interpretá-la para o usuário.
16. O usuário conversa com o agente dentro do chat.
17. As mensagens são persistidas.

## Regra importante sobre o modelo

O back-end não executa o modelo treinado diretamente.

O back-end deve chamar uma API externa responsável pela predição.

Portanto, evite escrever que o back-end “roda o modelo”, “executa o modelo localmente” ou “carrega o modelo treinado”.

Use formulações como:

* “o back-end chama a API de predição”;
* “a API externa executa o modelo treinado”;
* “o back-end recebe o resultado bruto da predição”;
* “o back-end persiste e retorna a predição”.

## Regra importante sobre o agente

O agente não deve ser acionado automaticamente na predição.

Primeiro, o usuário gera a predição e recebe o resultado bruto.

Depois, caso queira, o usuário clica em um botão para criar um chat a partir da predição.

Somente nesse chat o agente interpreta a predição.

## Restrição de domínio do agente

O agente deve recusar qualquer assunto fora do escopo.

O agente só pode responder sobre:

1. dados explícitos do contexto de treinamento/modelagem do sistema;
2. resultado bruto da predição;
3. explicação da predição;
4. variáveis usadas pelo modelo;
5. funcionalidades do próprio sistema.

O agente deve recusar perguntas sobre quaisquer outros assuntos.

Exemplos de assuntos que devem ser recusados:

* política;
* saúde;
* finanças;
* programação genérica;
* curiosidades;
* tarefas escolares fora do sistema;
* qualquer tema que não esteja ligado ao modelo, à predição ou ao funcionamento da aplicação.

A recusa deve ser educada e objetiva.

## Usuário visitante e sessão guest

O sistema deve aceitar uso sem conta.

Para usuários não autenticados:

* o front-end gera um `guest_session_id`;
* o valor é salvo no `localStorage`;
* o valor é enviado nas requisições ao back-end;
* o back-end usa esse identificador para associar predições, chats e mensagens ao visitante.

Para usuários autenticados:

* o sistema usa autenticação normal;
* o usuário pode possuir tokens de autenticação;
* o token pertence a um usuário autenticado.

## Entidades principais

Atualize o domínio para estas entidades:

### Usuário

Representa uma pessoa utilizando o sistema.

Pode ser:

* autenticado;
* visitante identificado por `guest_session_id`.

### Token de autenticação

Representa token/sessão de autenticação de usuário autenticado.

Relacionamento:

* 1 usuário autenticado pode ter 0 ou vários tokens;
* 1 token pertence a apenas 1 usuário autenticado.

### Predição

Representa uma consulta feita à API externa de predição.

Deve armazenar, conforme fizer sentido no projeto:

* usuário ou guest session relacionado;
* dados de entrada;
* resultado bruto da predição;
* data/hora da criação;
* metadados retornados pela API de predição, se existirem.

Relacionamento:

* 1 usuário pode ter 0 ou várias predições;
* 1 predição pertence a apenas 1 usuário ou sessão visitante.

### Chat

Representa uma conversa criada a partir de uma predição.

Relacionamento:

* 1 usuário pode ter 0 ou vários chats;
* 1 chat pertence a apenas 1 usuário ou sessão visitante;
* 1 chat pode estar vinculado a 1 predição.

### Mensagem

Representa uma mensagem dentro de um chat.

Relacionamento:

* 1 chat pode ter 1 ou várias mensagens;
* 1 mensagem pertence a apenas 1 chat.

A origem da mensagem pode ser:

* usuário;
* agente;
* sistema, se necessário.

## Relacionamentos principais

Use estes relacionamentos como referência:

```txt
Usuário/Sessão visitante 1:N Predição
Usuário/Sessão visitante 1:N Chat
Predição 0:N Chat
Chat 1:N Mensagem
Usuário autenticado 1:N Token de autenticação
```

Observação:

* Se o modelo de banco atual representar visitante de outro jeito, preserve a coerência com o código existente.
* Não invente relacionamento com entidades de estoque.

## Escopo funcional esperado

O `APPLICATION-SCOPE.md` deve passar a descrever funcionalidades como:

* autenticação de usuário;
* uso como visitante via `guest_session_id`;
* geração e persistência de predições;
* chamada para API externa de predição;
* visualização do resultado bruto da predição;
* criação de chat a partir de uma predição;
* envio e listagem de mensagens;
* interpretação da predição por agente inteligente;
* restrição de escopo do agente;
* histórico de predições;
* histórico de chats;
* tema claro e escuro, se já existir no projeto;
* dashboard ou tela inicial, se fizer sentido no projeto;
* documentação da API.

## Exemplos de rotas coerentes com o novo domínio

Caso existam exemplos literais de rotas, substituir por exemplos como:

```txt
POST /auth/login
POST /auth/logout
GET /auth/me

POST /predictions
GET /predictions

POST /chats
GET /chats
GET /chats/messages
POST /chats/messages
```

Não precisa implementar essas rotas nesta tarefa.

Apenas use exemplos coerentes na documentação.

## Exemplos de services coerentes

Caso existam exemplos literais de services, substituir por exemplos como:

```txt
auth.service.js
users.service.js
predictions.service.js
prediction-api.service.js
chats.service.js
messages.service.js
agent.service.js
log-app.service.js
```

## Exemplos de DTOs coerentes

Caso existam exemplos literais de DTOs, substituir por exemplos como:

```txt
dtos/auth/login.dto.js
dtos/prediction/create-prediction.dto.js
dtos/chat/create-chat.dto.js
dtos/message/create-message.dto.js
```

## Exemplos de repositories coerentes

Caso existam exemplos literais de repositories, substituir por exemplos como:

```txt
users.repository.js
predictions.repository.js
chats.repository.js
messages.repository.js
auth-tokens.repository.js
```

## Design Patterns

Preserve os Design Patterns já previstos.

Apenas troque os exemplos para o novo domínio.

Exemplos adequados:

### Repository Pattern

Usado para isolar consultas complexas ou específicas ao banco.

Exemplos:

* consultas de histórico de predições;
* consultas de chats por usuário ou sessão visitante;
* consultas de mensagens de um chat;
* consultas de tokens ativos.

### Service Layer

Usado para concentrar regras de aplicação.

Exemplos:

* validar e criar predição;
* chamar API externa de predição;
* criar chat a partir de predição;
* enviar mensagem ao agente;
* persistir mensagens;
* aplicar regra de escopo do agente.

### DTO

Usado para validar e padronizar entrada da API.

Exemplos:

* login;
* criação de predição;
* criação de chat;
* envio de mensagem.

### Singleton

Preserve para conexões compartilhadas, como banco, WebSocket ou clientes reutilizáveis.

### Observer

Se WebSocket continuar no projeto, os exemplos devem falar de atualização de telas, notificações ou atualização de histórico, não de estoque.

## Fora de escopo

O sistema não deve ser documentado como:

* sistema de estoque;
* controle de almoxarifado;
* inventário;
* controle de produtos;
* controle de filiais;
* movimentação de saldo;
* controle de equipamentos físicos.

Remova essas referências quando aparecerem como regra de produto.

## Critérios de aceite

A tarefa estará concluída quando:

1. `APPLICATION-SCOPE.md` estiver totalmente reescrito para o domínio de IA.
2. `PROJECT-CONTEXT.md` estiver ajustado apenas onde ainda citar estoque ou tema antigo.
3. `SOFTWARE-ARCHITECTURE.md` preservar a arquitetura atual e apenas trocar exemplos presos ao domínio antigo.
4. Não houver referências indevidas a estoque, produto, almoxarifado, inventário ou filial.
5. O fluxo correto estiver documentado:

   * front gera `guest_session_id`;
   * back chama API externa de predição;
   * back retorna resultado bruto;
   * usuário pode criar chat a partir da predição;
   * agente interpreta somente dentro do contexto permitido.
6. Os relacionamentos principais estiverem documentados.
7. A restrição de escopo do agente estiver explícita.
8. Nenhum código for implementado nesta tarefa.

## Importante

Não implementar código.

Não alterar arquitetura.

Não inventar módulos complexos que não foram descritos.

A tarefa é atualizar documentação `.md` dentro de `.agents/CORE`.

Ao final, responda com um resumo contendo:

1. arquivos alterados;
2. principais referências antigas removidas;
3. principais conceitos novos adicionados;
4. pontos que ainda ficaram ambíguos, se houver.

# Observações humanas
Foram dados alguns exemplos em inglês para nomes de rotas, funções, services, etc. Evite! Mantenha no padrão atual que é pt-br sem acentos, então seria /predicao e não /predict, saca?
