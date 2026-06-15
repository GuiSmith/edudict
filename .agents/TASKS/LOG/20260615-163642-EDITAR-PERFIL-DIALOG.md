Prompt:
Por fim, coloque um botão outlined primary na tela de perfil para editar perfil, ao clicar nele, aparece um dialog para editar o próprio usuário, o conteúdo do dialog pode ser o formulario de editar usuário, ok?

Interpretação e planejamento:
Implementar na tela de perfil um botão `outlined` com cor `primary` para edição do próprio perfil. Ao clicar, abrir um `Dialog` contendo um formulário de edição de usuário, preferencialmente reaproveitando o formulário/componente existente de editar usuário se já houver. A edição deve operar sobre o usuário autenticado, respeitar os padrões de arquitetura do front-end, Material UI e AuthContext, validar/atualizar dados via API existente de usuários, e atualizar a visualização após sucesso.

Motivo de não execução imediata:
A worktree não está limpa e contém alteração pendente fora de `.agents/TASKS` (`front/src/components/Navbar.jsx`), então a regra local de clean work tree impede iniciar esta nova tarefa agora.
