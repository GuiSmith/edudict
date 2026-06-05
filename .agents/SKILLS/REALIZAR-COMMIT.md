# REALIZAR-COMMIT.md

## Objetivo

Realizar commits organizados a partir das alterações existentes na worktree, deixando a worktree limpa ao final do processo.

Esta skill deve priorizar commits pequenos, coesos e com mensagens claras, evitando colocar alterações de contextos diferentes em um único commit quando for possível separá-las com segurança.

## Regras principais

* Não alterar, corrigir, formatar ou refatorar arquivos durante esta skill.
* Não executar mudanças no código além das operações necessárias para preparar e criar commits.
* Não fazer push.
* Não criar commit vazio.
* Não incluir arquivos não relacionados no mesmo commit.
* Não colocar a worktree inteira em um único commit por padrão.
* Criar mais de um commit quando houver alterações de contextos diferentes.
* O objetivo final é deixar a worktree limpa.
* Caso algo pareça errado, inconsistente, quebrado ou suspeito, seguir com o commit mesmo assim e alertar o usuário depois.
* Não interromper o processo apenas por suspeita de problema no código.
* Respeitar arquivos ignorados pelo Git.
* Nunca adicionar arquivos sensíveis, credenciais, `.env`, dumps, chaves privadas ou arquivos claramente temporários.
* Se notar diferença de chaves no `.env` e `.env.example` por favor me alerte sobre isso.

## Processo obrigatório

1. Verificar o estado atual da worktree.
2. Analisar as alterações existentes.
3. Agrupar as alterações por contexto lógico.
4. Definir quantos commits fazem sentido.
5. Preparar cada commit separadamente.
6. Criar commits usando mensagens no padrão definido.
7. Verificar se a worktree ficou limpa.
8. Informar ao usuário:

   * commits criados
   * arquivos incluídos em cada commit
   * se a worktree ficou limpa
   * alertas sobre qualquer coisa suspeita encontrada

## Agrupamento de alterações

As alterações devem ser separadas por intenção.

Exemplos de contextos lógicos:

* autenticação
* validação
* banco de dados
* migrations
* documentação
* estilização
* configuração
* testes
* correções de bug
* refatoração
* infraestrutura
* dependências

Se um arquivo tiver alterações misturadas de mais de um contexto, tentar separar apenas se isso for seguro.

Se a separação parcial de um arquivo for arriscada, confusa ou puder gerar commit quebrado, manter o arquivo inteiro no commit mais adequado e avisar o usuário.

## Mensagens de commit

Usar padrão de prefixo no estilo Conventional Commits.

Prefixos aceitos:

* `feat:` para nova funcionalidade
* `fix:` para correção
* `chore:` para manutenção, configuração ou tarefas auxiliares
* `docs:` para documentação
* `refactor:` para refatoração sem mudança de comportamento
* `style:` para ajustes visuais ou formatação sem mudança lógica
* `test:` para testes
* `build:` para build, dependências ou empacotamento
* `ci:` para integração contínua
* `perf:` para melhoria de performance
* `revert:` para reversão de alterações

A mensagem deve ser curta, objetiva e em português, salvo se o projeto já usar outro idioma.

Formato esperado:

* prefixo
* descrição curta
* sem ponto final

## Critérios para múltiplos commits

Criar múltiplos commits quando:

* houver alterações em áreas diferentes do sistema
* houver documentação junto com código
* houver configuração junto com regra de negócio
* houver correções independentes
* houver alterações de frontend e backend sem dependência direta
* houver migrations junto com implementação
* houver refatoração junto com funcionalidade nova

Criar commit único apenas quando:

* todas as alterações pertencem claramente ao mesmo objetivo
* separar os arquivos deixaria commits artificiais
* as mudanças são pequenas e fortemente relacionadas
* a separação aumentaria o risco de erro

## Restrições

Durante esta skill, não deve ser feito:

* correção de bugs
* refatoração
* formatação automática
* instalação de dependências
* execução de migrations
* alteração em `.gitignore`, salvo se já estiver modificado pelo usuário
* push para remoto
* rebase
* merge
* reset destrutivo
* descarte de alterações
* remoção de arquivos sem confirmação

## Alertas ao usuário

Após os commits, avisar se encontrar:

* arquivos sensíveis possivelmente versionados
* mudanças muito grandes em um único arquivo
* alterações de contextos diferentes no mesmo arquivo
* arquivos gerados automaticamente
* arquivos temporários
* conflitos aparentes
* código comentado suspeito
* logs de debug
* uso de valores hardcoded suspeitos
* mudanças que parecem quebrar padrão existente

Esses alertas não devem impedir o commit, apenas devem ser reportados no final.

## Resultado esperado

Ao final, a resposta deve informar:

* quantidade de commits criados
* mensagem de cada commit
* resumo dos arquivos incluídos em cada commit
* estado final da worktree
* alertas encontrados, se houver

Se não houver alterações para commit, informar que a worktree já está limpa e não criar nenhum commit.

## Corpo da mensagem de commit

Além do título, commits podem possuir corpo descritivo quando necessário.

O corpo da mensagem deve ser usado principalmente quando:

* a alteração não é trivial
* há múltiplas mudanças relacionadas
* existe impacto comportamental importante
* há decisões técnicas relevantes
* existem limitações ou observações importantes
* houve normalização, migração ou mudança estrutural
* o commit altera fluxo de autenticação, permissão, banco ou API

O corpo do commit deve:

* ficar separado do título por uma linha em branco
* explicar de forma objetiva o que foi alterado
* priorizar contexto e intenção
* evitar texto excessivamente longo
* evitar explicar código óbvio

Exemplos de informações úteis no corpo:

* regras adicionadas
* comportamento anterior vs novo
* impactos esperados
* motivo da alteração
* observações importantes
* limitações conhecidas

O corpo pode ser escrito em lista quando isso melhorar a leitura.

Nem todo commit precisa de corpo.

Commits simples e autoexplicativos podem conter apenas o título.
