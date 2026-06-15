Prompt:
Agora que é possível criar o próprio usuário, quero que crie uma tela de cadastro de usuário, mas antes disso, veja os arquivos padrões de arquitetura de software e me diga o que não está claro e você teria que 'inventar'

Interpretação e planejamento:
Antes de implementar qualquer tela, revisar a documentação central relevante, especialmente `.agents/CORE/SOFTWARE-ARCHITECTURE.md` e `.agents/CORE/APPLICATION-SCOPE.md`, além de documentação de autenticação/usuários se existir. Identificar, sem alterar código, quais decisões necessárias para uma tela de cadastro de usuário não estão definidas pela arquitetura ou escopo, como rota da tela, campos obrigatórios, permissões, validações, comportamento pós-cadastro, integração com API, mensagens de erro, UX, vínculo com login e regras para auto cadastro. Responder com uma lista objetiva do que está claro e do que exigiria suposição.

Motivo de não execução imediata:
A worktree não está limpa e contém alterações pendentes fora de `.agents/TASKS`, então a regra local de clean work tree impede iniciar esta nova análise agora.
