# Trocar ações da navbar

## Prompt

Consegue fazer o predições e novo chat ficar onde está agora o login/criar conta e vice-versa?

## Interpretação

Na navbar, trocar a posição dos grupos de ações:

- mover `Predições` e `Novo chat` para a posição atualmente ocupada por `Login` e `Criar conta`;
- mover `Login` e `Criar conta` para a posição atualmente ocupada por `Predições` e `Novo chat`;
- preservar rotas, regras de autenticação, responsividade, tema e comportamento atual dos botões.

## Planejamento

1. Conferir a implementação e os estados responsivos da navbar.
2. Reordenar os grupos sem alterar suas condições de exibição.
3. Validar visualmente e executar o lint do front-end dentro do container existente.
