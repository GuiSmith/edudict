# Skill: testar rota API

Use esta skill quando o usuário pedir para testar uma rota API do projeto `stocky`.

## Condição obrigatória

Antes de testar qualquer rota, verifique se pelo menos um destes containers está em execução:

- `stocky-dev-back`
- `stocky-back`

Se nenhum deles estiver rodando, pare e informe que o backend local não está ativo.

## Escopo

Esta skill deve ser usada apenas para testes locais do projeto `stocky`.

Se o usuário pediu o teste, assuma que está autorizado a:

- Executar chamadas HTTP contra a API.
- Inserir, alterar ou remover dados de teste.
- Acessar o banco de dados, se necessário.
- Fazer ajustes temporários em dados para validar cenários.

## Local dos arquivos de teste

Crie os arquivos de teste dentro do diretório:

`/testes`

Esse diretório fica na raiz do projeto `stocky`.

O diretório já está ignorado no `.gitignore`, então pode criar arquivos nele sem preocupação com versionamento.

## Execução dos testes

O teste pode ser feito por script, usando Node.js, curl, fetch, axios ou outra ferramenta adequada ao projeto.

O arquivo criado deve ter nome claro, relacionado à rota testada.

Exemplos de nomes válidos:

- `testarCriarUsuario`
- `testarLogin`
- `testarCriarProduto`
- `testarListarAlmoxarifados`

Não criar testes genéricos com nomes vagos.

## Logs obrigatórios

Todo teste executado deve gerar um arquivo `.log` dentro de `/testes`.

O nome do log deve seguir o nome do teste ou da rota testada.

Exemplo:

- `criarUsuario.log`
- `criarUsuario.log.1`
- `criarUsuario.log.2`

Se já existir um log com o mesmo nome, não sobrescreva o histórico. Crie o próximo arquivo numerado disponível.

O log deve registrar, no mínimo:

- Data e hora da execução.
- Rota testada.
- Método HTTP.
- Payload enviado, quando houver.
- Status code recebido.
- JSON/body retornado.
- Resultado final: sucesso ou falha.
- Erros encontrados, se houver.

## Banco de dados

Se necessário, pode acessar o banco de dados diretamente para:

- Preparar massa de teste.
- Consultar registros antes ou depois da chamada.
- Validar se a rota persistiu ou alterou dados corretamente.
- Limpar dados de teste, quando fizer sentido.

Não precisa pedir permissão extra para isso quando o usuário já pediu o teste da rota.

## Critérios de validação

Ao testar uma rota, valide:

- Se o status code está coerente.
- Se o body retornado segue o contrato esperado.
- Se mensagens de erro são claras.
- Se dados obrigatórios são realmente exigidos.
- Se dados inválidos são recusados.
- Se dados válidos são aceitos.
- Se a alteração no banco ocorreu corretamente, quando aplicável.

## Resultado para o usuário

Ao final, informe de forma objetiva:

- Qual rota foi testada.
- Qual arquivo de teste foi criado.
- Qual arquivo de log foi gerado.
- Se o teste passou ou falhou.
- O principal motivo da falha, se houver.

Não inclua o conteúdo completo do arquivo de teste na resposta, a menos que o usuário peça.