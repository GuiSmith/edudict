# DOCUMENTAR-WIKI-SISTEMA.md

## Objetivo

Criar ou atualizar uma página de wiki do sistema no front-end, atuando como Product Owner e Product Manager.

A wiki deve documentar as funcionalidades já implementadas no código, com linguagem clara o suficiente para usuários comuns e detalhada o suficiente para suporte técnico entender fluxos, regras e módulos do sistema.

## Arquivo alvo

Criar ou atualizar:

`src/pages/docs/wiki/index.js`

## Papel esperado

Atue como:

* Product Owner, entendendo o valor funcional de cada módulo.
* Product Manager, organizando a documentação por domínio, fluxo e uso prático.
* Analista funcional, explicando comportamento real do sistema com base no código existente.
* Suporte técnico, antecipando dúvidas comuns de operação.

## Fonte de verdade obrigatória

Antes de escrever a wiki, leia:

* `SOURCE-OF-TRUTH.md`
* Rotas do back-end
* Controllers
* Services
* DTOs
* Páginas existentes do front-end
* Componentes reutilizáveis
* Contexts/hooks relevantes

A wiki deve refletir o que está implementado no código atual, não apenas o que está planejado.

Quando houver diferença entre o `SOURCE-OF-TRUTH.md` e o código, priorize o código implementado e registre a diferença na seção "Observações técnicas" ou "Funcionalidades previstas".

## Estrutura visual esperada

Criar uma página de documentação com layout organizado.

Preferência de interface:

* Página em Material UI.
* Um card principal.
* Abas laterais verticais.
* Cada aba representa um módulo, domínio ou entidade do sistema.
* Conteúdo da aba deve ser legível, bem espaçado e dividido em seções.

Exemplos de abas possíveis:

* Visão geral
* Autenticação
* Usuários
* Permissões
* Filiais
* Almoxarifados
* Produtos
* Produtos únicos
* Estoque
* Inventários
* Logs
* Dashboard
* Integrações
* Arquitetura técnica

Use apenas abas que façam sentido com o código existente.

## Conteúdo mínimo por módulo

Para cada módulo documentado, incluir quando aplicável:

1. Objetivo do módulo
2. Para que ele serve no sistema
3. Quem normalmente usa
4. Funcionalidades disponíveis
5. Fluxo principal de uso
6. Campos importantes
7. Regras de negócio identificadas no código
8. Permissões envolvidas, se existirem
9. Efeitos no banco de dados
10. Logs gerados, se existirem
11. Erros comuns ou validações relevantes
12. Observações úteis para suporte técnico
13. Funcionalidades previstas, caso estejam documentadas mas ainda não implementadas

## Linguagem

A linguagem deve ser humana, objetiva e explicativa.

Evite documentação excessivamente técnica para o usuário comum, mas mantenha detalhes suficientes para suporte técnico.

Use frases como:

* "Este módulo permite..."
* "Na prática, isso significa que..."
* "O suporte deve observar..."
* "Quando essa ação acontece, o sistema..."

Evite escrever como comentário de código.

## Restrições importantes

* Não invente funcionalidade que não existe.
* Não documente como pronto algo que está apenas previsto.
* Não remova código funcional existente sem necessidade.
* Não altere rotas do back-end.
* Não altere regras de negócio.
* Não altere banco de dados.
* Não implemente funcionalidades novas além da página de wiki.
* Não use dados fictícios como se fossem reais.
* Não exponha senhas, tokens, secrets ou dados sensíveis.

## Critérios de qualidade

A entrega será considerada boa quando:

* A página abrir corretamente em `/docs/wiki`.
* A documentação estiver organizada por módulos.
* A interface for confortável de ler.
* O conteúdo explicar o sistema para usuário comum e suporte técnico.
* O texto diferenciar claramente o que está implementado do que está previsto.
* A wiki estiver alinhada com o código atual.
* A página usar componentes e padrões visuais já existentes no projeto quando possível.
* Não houver quebra de lint/build.

## Processo obrigatório

1. Ler a fonte da verdade do projeto.
2. Inspecionar o código atual do front-end e back-end.
3. Identificar módulos realmente implementados.
4. Criar a estrutura da página.
5. Escrever a wiki por módulo.
6. Separar funcionalidades implementadas de funcionalidades previstas.
7. Revisar se o conteúdo está coerente com o código.
8. Rodar validações disponíveis, como lint ou build, se existirem scripts no projeto.
9. Atualizar o `SOURCE-OF-TRUTH.md` somente se a implementação da wiki revelar uma divergência relevante de documentação do projeto.

## Resultado esperado

Ao final, entregar uma página de wiki funcional no front-end, em:

`src/pages/docs/wiki/index.js`

A página deve servir como documentação viva do sistema, útil para apresentação acadêmica, suporte técnico, usuários finais e manutenção futura.
