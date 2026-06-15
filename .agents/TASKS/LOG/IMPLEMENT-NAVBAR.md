# Implementar Navbar Lateral

## Objetivo

Implementar uma navbar lateral esquerda no front-end, integrada ao layout global da aplicação, respeitando autenticação, tema, responsividade e arquitetura existente do projeto.

## Regras obrigatórias

Antes de implementar, leia e siga as instruções do `.AGENTS.md` e do diretório `.agents`.

Investigue a estrutura atual do front-end antes de alterar código. Não crie arquitetura paralela se já existir padrão no projeto.

## Contextos obrigatórios

A implementação depende da existência de:

* Contexto de autenticação com os estados `usuario` e `estaAutenticado`.
* Contexto de tema com estado/função para alternar entre modo claro e modo escuro.

Se algum desses contextos não existir ou não expuser os dados necessários, interrompa a implementação e documente claramente o motivo.

A navbar não deve inferir autenticação, usuário ou tema por conta própria. Ela deve consumir exclusivamente os contextos existentes.

## Estrutura da navbar

A navbar deve ser lateral esquerda.

Cada item deve ser composto por:

`<ícone> <texto>`

Quando a navbar estiver expandida, deve aparecer ícone e texto.

Quando a navbar estiver colapsada em desktop, deve aparecer apenas o ícone.

O estado de colapso da navbar em desktop deve ser salvo no `localStorage`.

Como o front-end é completamente client-side, ainda assim evite acessar `localStorage` fora do ambiente do navegador.

## Toggle de colapso

A navbar deve ter um ícone de sanduíche para alternar entre expandida e colapsada.

Em desktop:

* Expandida: mostra ícone e texto.
* Colapsada: mostra apenas os ícones.
* O estado deve ser persistido no `localStorage`.

Em mobile:

* A navbar deve funcionar como drawer.
* Quando fechada, não deve aparecer nem parcialmente.
* Ao clicar no ícone de sanduíche, a navbar deve abrir sobrepondo a tela.
* Ao clicar fora da navbar, ela deve fechar.
* Ao clicar novamente no ícone de sanduíche, ela também deve fechar.
* O comportamento mobile não deve ser confundido com o collapsed desktop.

## Layout global

A navbar deve ser integrada ao layout global da aplicação.

Ela deve ficar no extremo esquerdo da tela, com `margin-left: 0`.

O conteúdo principal deve se ajustar corretamente ao espaço ocupado pela navbar no desktop.

No mobile, como a navbar vira drawer sobreposto, o conteúdo principal não deve receber margem lateral fixa por causa da navbar.

## Tipos de rotas

Existem três tipos de telas:

### Públicas

Podem ser acessadas independentemente do estado de autenticação do usuário.

Por enquanto, são:

* Tela inicial.
* Documentação de API.
* Wiki.

### Convidado

Podem ser acessadas somente por usuários não autenticados.

Por enquanto, é:

* Login.

### Privadas

Todas as outras telas são privadas.

Só podem ser acessadas por usuários autenticados.

## Exibição dos links

A navbar deve respeitar o tipo da rota:

* Usuário autenticado pode ver rotas públicas e privadas.
* Usuário não autenticado pode ver rotas públicas e rotas de convidado.
* Usuário autenticado não deve ver rotas exclusivas de convidado, como login.
* Usuário não autenticado não deve ver rotas privadas.

Também deve haver proteção/redirecionamento coerente para acesso direto pela URL:

* Usuário não autenticado tentando acessar rota privada deve ser redirecionado para login.
* Usuário autenticado tentando acessar rota de convidado deve ser redirecionado para uma rota adequada, preferencialmente a tela inicial ou dashboard, conforme padrão existente no projeto.
* Rotas públicas não devem redirecionar por estado de autenticação.

## Descoberta de páginas

O Codex pode verificar o diretório `front/src/pages` para identificar páginas existentes.

Regra do projeto:

* Arquivos `.js` representam páginas.
* Arquivos `.jsx` representam componentes.
* `index.js` normalmente representa página principal de um diretório.

Não incluir na navbar:

* Arquivos/componentes `.jsx`.
* Rotas internas de API, se existirem no front.
* `_app.js`.
* `_document.js`.
* `_error.js`, se existir.
* Arquivos de teste, mock, debug ou desenvolvimento.
* Qualquer arquivo que pelas regras do projeto não represente uma tela navegável.

## Ícones

O Codex pode escolher os ícones que fizerem mais sentido para cada página, usando o padrão de biblioteca já adotado no projeto.

Se o projeto usa Material UI, preferir ícones do Material UI.

Cada link deve possuir tooltip do MUI, principalmente para o estado colapsado.

Evite usar `title` HTML puro quando houver Tooltip do MUI disponível.

## Perfil do usuário

O link de perfil deve usar exclusivamente a imagem do usuário como ícone.

Se `usuario` não possuir imagem disponível, usar o componente `Avatar` padrão do Material UI como fallback.

O item de perfil deve continuar respeitando as regras de autenticação: só deve aparecer quando fizer sentido para usuário autenticado.

## Tema claro/escuro

No canto inferior da navbar deve haver um botão/ícone para alternar entre modo claro e modo escuro.

Esse botão deve usar exclusivamente o contexto de tema existente.

Não criar persistência própria de tema dentro da navbar, caso o contexto já faça isso.

## Rota ativa

A navbar deve destacar visualmente a rota atual.

O destaque deve funcionar tanto em desktop quanto em mobile.

O estilo deve seguir o padrão visual já existente no projeto.

## Acessibilidade

Implementar acessibilidade básica:

* Botões com `aria-label`.
* Links acessíveis por teclado.
* Tooltips nos ícones.
* Estado visual claro para item ativo.
* Contraste adequado nos modos claro e escuro.
* Não depender apenas de cor para transmitir estado, se houver padrão melhor no projeto.

## Responsividade

Em desktop, a navbar é fixa/lateral e pode ser expandida ou colapsada.

Em mobile, a navbar deve funcionar como drawer sobreposto.

Use os breakpoints/padrões já existentes no projeto. Se o projeto usa Material UI, preferir `useMediaQuery`, `Drawer`, `Tooltip`, `Avatar`, `IconButton` e demais componentes adequados do MUI.

## Boas práticas

Evite criar excesso de estados locais desnecessários.

Separe responsabilidades quando fizer sentido:

* Configuração/lista de rotas.
* Componente visual da navbar.
* Item individual da navbar.
* Regras de filtro por autenticação.
* Integração no layout global.

Não criar centenas de flags booleanas pequenas para controlar JSX se isso puder ser resolvido com estrutura de dados clara, funções auxiliares bem nomeadas ou componentes menores.

Não duplicar lógica de autenticação ou tema.

Não alterar regras de negócio fora do escopo da navbar, exceto se for necessário para proteção/redirecionamento de rotas.

## Validação final

Ao terminar, validar:

* Navbar aparece corretamente em desktop.
* Collapse desktop funciona e persiste no `localStorage`.
* Mobile funciona como drawer.
* Clique fora fecha o drawer mobile.
* Ícone sanduíche abre/fecha corretamente.
* Links aparecem conforme autenticação.
* Rota ativa é destacada.
* Link de perfil usa imagem do usuário ou Avatar fallback.
* Toggle de tema funciona usando o contexto existente.
* Rotas privadas, públicas e de convidado respeitam as regras definidas.
* O layout global não fica quebrado.
* O projeto continua seguindo `.AGENTS.md` e `.agents`.
