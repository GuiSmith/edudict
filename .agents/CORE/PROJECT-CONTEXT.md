# Contexto do Projeto

## Contexto acadêmico

O edudict é um trabalho acadêmico da disciplina Programação III.

A disciplina pertence aos cursos Ciência da Computação e Sistemas de Informação e o projeto está sendo desenvolvido no contexto universitário em Chapecó/SC.

O professor da disciplina é Wagner Titon.

## Tema escolhido

O tema escolhido pelo grupo é uma aplicação web de inteligência artificial preditiva com agente inteligente.

O sistema recebeu o nome edudict.

O usuário informa os dados necessários para uma predição, o back-end consulta uma API externa que executa o modelo treinado e devolve o resultado bruto. Opcionalmente, o usuário pode criar um chat vinculado à predição para que um agente inteligente interprete o resultado dentro do domínio permitido pelo sistema.

## Datas

* Entrega/apresentação: 23/06/2026.
* Meta interna para finalizar o código: 19/06/2026.

## Objetivo da avaliação

O objetivo principal da avaliação é demonstrar capacidade de estruturar o código de um software com arquitetura organizada, separação de responsabilidades e aplicação de Design Patterns.

A aplicação deve ter:

* Front-end web.
* Back-end estruturado.
* Banco de dados.
* Arquitetura organizada.
* Design Patterns aplicados e explicados.

## Design Patterns exigidos

O grupo deve usar no mínimo 3 Design Patterns e explicar onde e por que foram utilizados.

No edudict, os padrões previstos como referência arquitetural são:

* Repository Pattern.
* Service Layer.
* DTO.
* Singleton.
* Observer.

## API REST

A API REST é opcional no enunciado, mas será implementada no edudict como parte da arquitetura da solução.

## Banco de dados

O banco de dados é obrigatório e deve possuir:

* Modelagem básica.
* Relacionamentos.
* Scripts de criação.
* Dados de teste.

## Interface web

A interface web deve ser:

* Funcional.
* Navegável.
* Organizada.
* Responsiva.
* Com boa experiência de usuário.

## Documento técnico final

O documento técnico final deve conter:

* Nome do projeto.
* Objetivo da solução.
* Tecnologias utilizadas.
* Arquitetura adotada.
* Explicação dos Design Patterns.
* Estrutura do banco.
* Diagrama simplificado.
* Prints da aplicação.
* Explicação da API.
* Dificuldades encontradas.

## Apresentação final

A apresentação final deve ter de 5 a 10 minutos por grupo e demonstrar:

* Funcionamento do sistema.
* Arquitetura.
* Padrões aplicados.
* Organização do código.
* Diferenciais implementados.

## Entregáveis acadêmicos

O projeto deverá entregar:

* Código-fonte no GitHub ou GitLab -> repositório atual
* Documento técnico -> será criado baseado no `APPLICATION-SCOPE.md` + `SOFTWARE-ARCHITECTURE.md`
* Scripts de criação do banco -> diretório `back/src/database`
* Dados de teste -> depois verei
* Prints da aplicação -> depois verei
* Diagrama simplificado da arquitetura -> depois verei
* Explicação da API -> arquivo `front/docs/api/openapi.yml` + página `front/src/pages/docs/api.js`
* Explicação dos Design Patterns -> será criado com base em `SOFTWARE-ARCHITECTURE.md`
