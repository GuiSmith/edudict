# Implementação da Tela de Cadastro de Usuário

Antes de iniciar qualquer alteração, leia os arquivos de arquitetura do projeto (`.agents/CORE/*`) para garantir aderência aos padrões estabelecidos.

## Objetivo

Implementar uma tela de auto cadastro de usuários no front-end, permitindo que visitantes criem suas próprias contas.

A funcionalidade deve seguir os padrões arquiteturais já existentes no projeto, reutilizando componentes, contextos, helpers e padrões visuais sempre que possível.

---

## Regras de Negócio

### Acesso

A tela de cadastro é uma rota de convidado (guest only).

Usuários autenticados não devem acessar esta tela.

A rota deve seguir o padrão:

```txt
/usuarios/novo
```

A página deve ser adicionada ao fluxo de navegação para visitantes, incluindo um link visível na tela de login.

Exemplo de texto:

```txt
Criar conta
```

---

## Campos do Formulário

A tela deve possuir os seguintes campos:

### Nome

Obrigatório.

### CPF

Obrigatório.

Utilizar máscara visual de CPF durante a digitação.

Exemplo:

```txt
123.456.789-00
```

Antes de enviar para a API, remover toda formatação e enviar apenas os 11 dígitos.

### E-mail

Obrigatório.

Utilizar validação básica de formato de e-mail no front-end.

### Senha

Obrigatória.

Validação mínima:

* não pode ser vazia

### Confirmar Senha

Campo exclusivamente visual.

Não deve ser enviado para a API.

Deve impedir envio caso seja diferente da senha.

---

## Integração com API

Utilizar:

```http
POST /usuarios
```

Payload:

```json
{
  "nome": "João da Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "senha": "123456"
}
```

Não enviar:

```json
{
  "ativo": true
}
```

O backend deve assumir automaticamente que usuários criados por auto cadastro iniciam ativos.

---

## Tratamento de Erros

A API já retorna erros estruturados.

Utilizar React Toastify para feedback ao usuário.

### Erros de validação

Exibir mensagem amigável utilizando as informações retornadas pela API.

### Conflitos

Exemplos:

```txt
CPF já cadastrado
```

```txt
E-mail já cadastrado
```

Devem ser exibidos via toast.

### Erros inesperados

Exibir mensagem genérica:

```txt
Ocorreu um erro ao realizar o cadastro.
Tente novamente mais tarde.
```

---

## Fluxo de Sucesso

Após cadastro realizado com sucesso:

1. Exibir toast de sucesso.
2. Redirecionar para a tela de login.

Exemplo:

```txt
Cadastro realizado com sucesso.
Faça login para continuar.
```

Não realizar login automático.

---

## Layout

Seguir os padrões visuais já existentes no projeto:

* Material UI
* ThemeContext
* Componentes compartilhados já existentes
* Responsividade para mobile e desktop

A página deve possuir:

* título
* descrição curta
* formulário
* botão de cadastrar
* link para login

Exemplo:

```txt
Já possui uma conta?
Entrar
```

---

## Navbar

Como a funcionalidade é pública, adicionar item de navegação para visitantes apontando para:

```txt
/usuarios/novo
```

Seguir o mesmo padrão utilizado pelas demais rotas públicas.

---

## Atualização da Documentação

Atualizar a documentação OpenAPI para refletir o comportamento atual do sistema.

Atualmente existe inconsistência entre documentação e implementação.

### Ajustar

`POST /usuarios`

para ser documentado como endpoint público.

Remover exigência de autenticação desta operação na documentação.

Manter autenticação obrigatória apenas para operações administrativas de usuários.
