# Escopo da Aplicação

## Objetivo da solução

O objetivo do edudict é permitir o gerenciamento de estoque de uma organização com múltiplas filiais, almoxarifados, usuários e produtos.

A aplicação permitirá controlar:

* Produtos comuns: produtos que apenas possuem saldo
* Produtos únicos com número de série e MAC: produtos onde cada unidade de saldo representa um objeto físico real
* Movimentações de estoque.
* Associação de usuários a almoxarifados.
* Inventários de estoque.

## Escopo funcional principal

O sistema terá:

* Autenticação de usuários: login + logout
* Gerenciamento de usuários: cadastro + edição
* Tema claro e escuro.
* Dashboard com dados em tempo real via WebSocket.
* Gerenciamento de filiais: cadastro + edição
* Gerenciamento de almoxarifados: cadastro + edição
* Associação de usuários a almoxarifados.
* Cadastro de produtos.
* Cadastro de produtos únicos.
* Controle de saldo de estoque por almoxarifado e filial.
* Inventário de estoque.
* Envio de e-mails via fila com RabbitMQ.
* Integração com serviço externo de arquivos como OperaFR.

## Módulos funcionais

### Autenticação

* Login.
* Logout.
* Proteção de rotas.
* Token JWT.
* Verificação de usuário autenticado.

### Usuários

* Cadastro de usuários.
* Listagem de usuários. 
* Edição de usuários.
* Associação de usuários a almoxarifados.

### Filiais

* Cadastro de filiais.
* Edição de filiais.
* Listagem de filiais.

### Almoxarifados

* Cadastro de almoxarifados.
* Associação com usuários.
* Visualização de estoque por almoxarifado.

### Produtos

* Cadastro de produtos.
* Classificação entre produto comum e produto único.
* Unidade de medida.
* Estoque mínimo.
* Estoque atual.
* Associação com almoxarifado e filial.

### Produtos únicos

Produtos únicos são produtos controlados individualmente.

Exemplos:

* Roteador com número de série.
* Equipamento com MAC address.
* ONU.
* Switch.
* Notebook.

Campos possíveis:

* Produto base.
* Número de série.
* MAC.
* Status.
* Almoxarifado atual.
* Filial atual.

### Produtos comuns

Produtos comuns são produtos controlados por quantidade.

Exemplos:

* Cabo.
* Parafuso.
* Conector.
* Abraçadeira.
* Etiqueta.

Campos possíveis:

* Produto.
* Unidade de medida.
* Quantidade.
* Almoxarifado.
* Filial.

## Inventário

O inventário permitirá que um usuário confira o estoque físico de um almoxarifado.

Funcionalidades previstas:

* Criar inventário.
* Selecionar almoxarifado.
* Listar produtos esperados.
* Informar quantidade encontrada.
* Informar produtos únicos encontrados.
* Registrar divergências.
* Finalizar inventário.
* Gerar histórico.

Cada item inventariado também possuirá vínculo com uma filial.

## Dashboard em tempo real

A dashboard poderá exibir:

* Total de produtos cadastrados.
* Total de itens em estoque.
* Produtos abaixo do estoque mínimo.
* Últimas movimentações.
* Inventários em andamento.
* Divergências recentes.

As atualizações poderão ser enviadas em tempo real via WebSocket.

## Integrações no escopo funcional

### RabbitMQ

RabbitMQ está previsto para envio assíncrono de e-mails.

### OperaFR

OperaFR está previsto como serviço externo para armazenamento e gerenciamento de arquivos.

## Diferenciais do projeto

* WebSocket para atualização em tempo real.
* RabbitMQ para envio assíncrono de e-mails.
* Gerenciamento de anexos.
* Tema claro e escuro.
* Interface responsiva.
* Controle de produtos únicos por número de série e MAC.
* Inventário com registro de divergências.
* Controle de estoque separado por filial.
