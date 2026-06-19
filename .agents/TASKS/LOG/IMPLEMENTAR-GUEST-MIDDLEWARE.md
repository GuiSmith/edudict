# Criar `guest.middleware.js`

## Objetivo

Criar um middleware chamado `guest.middleware.js` para permitir que rotas específicas sejam acessadas por usuários autenticados ou por usuários convidados.

O middleware deve ser executado **depois do `auth.middleware.js`**. Portanto, se o usuário já estiver autenticado e `req.user` existir, o middleware deve apenas liberar a requisição.

---

## Regra principal

O middleware deve funcionar assim:

```js
if (req.user) {
    return next();
}
```

Caso `req.user` não exista, o middleware deve validar o header:

```http
X-Guest-Session-Id
```

Se o header existir e for um UUID válido, o middleware deve adicionar:

```js
req.guest_session_id = valorDoHeader;
```

e permitir que a requisição continue.

Se não houver usuário autenticado e também não houver um `X-Guest-Session-Id` válido, a requisição deve ser rejeitada.

---

## Rotas onde o middleware será usado

O middleware deve ser aplicado apenas em rotas pré-definidas que aceitam uso por convidado.

Exemplo atual:

```txt
POST /predict
```

Futuramente também poderá ser usado em rotas como:

```txt
POST /chat
POST /mensagem
GET /mensagens
```

Não aplicar esse middleware globalmente na aplicação.

---

## Comportamento esperado

### Cenário 1 — Usuário autenticado

Se `req.user` existir:

```js
return next();
```

Não definir `req.guest_session_id`.

---

### Cenário 2 — Usuário convidado válido

Se `req.user` não existir, mas o header `X-Guest-Session-Id` existir e for um UUID válido:

```js
req.guest_session_id = valorDoHeader;
return next();
```

---

### Cenário 3 — Usuário não autenticado e sem guest válido

Se `req.user` não existir e o header estiver ausente, vazio ou inválido, lançar erro de autorização seguindo o padrão de erros já existente no projeto.

---

## Requisitos técnicos

* Criar o arquivo `guest.middleware.js` no diretório de middlewares do backend.
* Seguir o padrão arquitetural já existente no projeto.
* Usar o mesmo padrão de tratamento de erros dos middlewares atuais.
* Não alterar o comportamento do `auth.middleware.js`.
* Não criar `req.identity`.
* Não criar `req.user` dentro do middleware.
* Apenas definir `req.guest_session_id` quando o acesso for por convidado.
* Validar se o `X-Guest-Session-Id` é um UUID válido.
* Rejeitar strings vazias ou valores inválidos.
* Aplicar o middleware apenas nas rotas que precisam aceitar usuário convidado, começando por `POST /predict`.

---

## Exemplo de uso esperado

No server.js, colocar logo após o middleware de autenticação:

``` js
// server.js
app.use(authMiddleware); // <- já existe
app.use(guestMiddleware);
```

Neste fluxo:

1. `authMiddleware` tenta autenticar o usuário.
2. Se autenticar, define `req.user`.
3. `guestMiddleware` verifica `req.user`.
4. Se `req.user` existir, libera.
5. Se `req.user` não existir, valida `X-Guest-Session-Id`.
6. Se o guest id for válido, define `req.guest_session_id`.
7. Caso contrário, rejeita a requisição.
