# Escopo da Aplicação

## Objetivo da solução

O objetivo do edudict é oferecer uma aplicação web de inteligência artificial preditiva na qual usuários autenticados ou visitantes possam informar dados, receber o resultado bruto de uma predição e, opcionalmente, criar um chat para obter uma interpretação contextualizada desse resultado.

O modelo treinado não é executado pelo back-end do edudict. O back-end valida os dados recebidos, chama uma API externa responsável pela predição, persiste a consulta e devolve ao front-end o resultado bruto retornado.

O agente inteligente também não é acionado automaticamente durante a predição. Depois de visualizar o resultado bruto, o usuário decide se deseja criar um chat vinculado àquela predição. Somente dentro desse chat o agente recebe o contexto necessário para interpretar o resultado.

## Escopo funcional principal

O sistema terá:

* Autenticação de usuários: login e logout.
* Uso sem conta por meio de `guest_session_id`.
* Geração e persistência de predições.
* Integração com uma API externa de predição.
* Visualização do resultado bruto retornado pela API externa.
* Criação opcional de chat a partir de uma predição.
* Envio, persistência e listagem de mensagens.
* Interpretação da predição por um agente inteligente.
* Restrição do agente aos assuntos permitidos pelo domínio.
* Histórico de predições.
* Histórico de chats.
* Tema claro e escuro.
* Interface responsiva.
* Documentação da API.

## Módulos funcionais

### Autenticação

* Login.
* Logout.
* Proteção de rotas.
* Token de autenticação.
* Verificação de usuário autenticado.

Usuários autenticados podem possuir um ou vários tokens, e cada token pertence a apenas um usuário.

### Sessão visitante

O sistema deve permitir o uso sem conta.

Para usuários não autenticados:

* O front-end gera um `guest_session_id`.
* O identificador é salvo no `localStorage`.
* O identificador é enviado nas requisições ao back-end.
* O back-end associa predições, chats e mensagens à sessão visitante.

O `guest_session_id` identifica uma sessão visitante e não deve ser tratado como token de autenticação.

### Predições

Uma predição representa uma consulta feita à API externa que contém e executa o modelo treinado.

Fluxo:

1. O usuário informa os dados exigidos pelo modelo.
2. O front-end envia os dados e a identificação do usuário ou da sessão visitante.
3. O back-end valida e normaliza os dados por meio de DTO.
4. Um service chama a API externa de predição.
5. A API externa executa o modelo e retorna o resultado.
6. O back-end persiste os dados de entrada, o resultado bruto e os metadados aplicáveis.
7. O back-end devolve o resultado bruto ao front-end.
8. O front-end apresenta o resultado sem acionar automaticamente o agente.

Uma predição pode armazenar:

* Usuário autenticado ou `guest_session_id`.
* Dados de entrada enviados.
* Resultado bruto da predição.
* Data e hora de criação.
* Metadados retornados pela API externa, quando existirem.

O sistema deve permitir consultar o histórico de predições associado ao usuário autenticado ou à sessão visitante.

### Chats

O chat é criado apenas quando o usuário solicita uma interpretação para uma predição já realizada.

Regras:

* O chat deve pertencer a um usuário autenticado ou a uma sessão visitante.
* O chat pode estar vinculado a uma predição.
* Quando uma mensagem for enviada sem a identificação de um chat existente, o sistema deve criar um novo chat e persistir a mensagem nele.
* Quando uma predição for informada na criação do chat, ela deve existir e pertencer ao mesmo usuário autenticado ou à mesma sessão visitante que está criando o chat.
* O título do chat deve ser formado pelas primeiras 25 linhas da primeira mensagem enviada, respeitando o limite de armazenamento do título.
* Ao criar o chat a partir de uma predição, o agente recebe o resultado bruto e o contexto permitido.
* Criar uma predição não cria nem aciona um chat automaticamente.
* O sistema deve permitir consultar o histórico de chats do usuário ou da sessão visitante.

### Mensagens

Uma mensagem representa uma interação dentro de um chat.

* Cada mensagem pertence a apenas um chat.
* Um chat pode possuir uma ou várias mensagens.
* A origem da mensagem pode ser o usuário, o agente ou o sistema, quando necessário.
* Cada chat pode receber no máximo 10 mensagens com origem no usuário.
* Uma mensagem do usuário pode possuir no máximo 500 caracteres.
* Uma mensagem do agente pode possuir no máximo 1.000 caracteres.
* Mensagens do usuário e respostas do agente devem ser persistidas.
* O consumo de tokens informado pelo serviço do agente deve ser persistido junto à resposta, quando estiver disponível.
* O sistema deve permitir listar as mensagens de um chat respeitando seu proprietário.

### Agente inteligente

O agente tem a função de interpretar a predição e explicar informações relacionadas ao funcionamento do sistema.

O agente só pode responder sobre:

1. Dados explícitos do contexto de treinamento e modelagem fornecido ao sistema.
2. Resultado bruto da predição vinculada ao chat.
3. Explicação da predição.
4. Variáveis utilizadas pelo modelo.
5. Funcionalidades do próprio edudict.

O agente deve recusar, de forma educada e objetiva, qualquer assunto fora desse escopo. Isso inclui política, saúde, finanças, programação genérica, curiosidades, tarefas escolares não relacionadas ao sistema e qualquer outro tema sem relação com o modelo, a predição ou a aplicação.

### Usuários

O usuário representa uma pessoa que utiliza o sistema. O uso pode ocorrer:

* Como usuário autenticado, identificado pela autenticação normal.
* Como visitante, identificado por `guest_session_id`.

Predições e chats devem ser associados a uma dessas formas de identificação para impedir acesso indevido ao histórico de outra pessoa ou sessão.

## Integrações no escopo funcional

### API externa de predição

É responsável por executar o modelo treinado.

O back-end do edudict:

* Envia os dados validados.
* Recebe o resultado bruto.
* Trata falhas de comunicação.
* Persiste e retorna a predição.

### Serviço de agente LLM

É responsável por gerar respostas dentro do chat usando o contexto permitido da predição e do sistema.

O back-end deve controlar o contexto enviado ao serviço e aplicar a restrição de domínio do agente.

## Entidades e relacionamentos principais

### Usuário

Representa o usuário autenticado. Pode possuir tokens, predições e chats.

### Token de autenticação

Representa uma sessão de autenticação:

* Um usuário autenticado pode ter zero ou vários tokens.
* Um token pertence a apenas um usuário autenticado.

### Predição

Representa uma consulta feita à API externa:

* Um usuário ou sessão visitante pode ter zero ou várias predições.
* Uma predição pertence a apenas um usuário ou sessão visitante.

### Chat

Representa uma conversa opcional criada a partir de uma predição:

* Um usuário ou sessão visitante pode ter zero ou vários chats.
* Um chat pertence a apenas um usuário ou sessão visitante.
* Uma predição pode ter zero ou vários chats.
* Um chat pode estar vinculado a uma predição.

### Mensagem

Representa uma interação dentro de um chat:

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

## Diferenciais do projeto

* Uso autenticado ou como visitante.
* Integração desacoplada com API externa de predição.
* Resultado bruto disponível antes de qualquer interpretação.
* Chat opcional e contextualizado por predição.
* Agente com restrição explícita de domínio.
* Persistência dos históricos de predições, chats e mensagens.
* Tema claro e escuro.
* Interface responsiva.
