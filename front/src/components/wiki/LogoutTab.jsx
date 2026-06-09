import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Endpoint e token utilizado",
    items: [
      "Rota: POST /auth/logout.",
      "O token é lido primeiro do header Authorization e, se não existir, do cookie token.",
      "O cookie token é limpo na resposta com as mesmas opções base usadas na criação.",
    ],
  },
  {
    title: "Fluxo principal",
    items: [
      "O controller extrai o token da requisição e chama o service de logout.",
      "O service procura o token no banco dentro de uma transação.",
      "Se o token existir e estiver ativo, o sistema atualiza ativo para false.",
      "A resposta de sucesso é 204 sem body.",
    ],
  },
  {
    title: "Regras de negócio identificadas",
    items: [
      "Logout não exclui token; ele inativa o registro.",
      "Token inexistente ou já inativo não gera nova alteração de banco.",
      "Depois do logout, o middleware de autenticação rejeita o mesmo token porque ativo passa a ser false.",
    ],
  },
  {
    title: "Efeitos no banco e logs",
    items: [
      "Atualiza a tabela token, alterando ativo de true para false.",
      "Registra log_app com operação LOGOUT apontando para a tabela token.",
      "No log_app, antes contém o token antes da alteração e depois contém o token com ativo=false.",
      "O resultado HTTP do logout fica no log_api, não no log_app.",
    ],
  },
  {
    title: "Observações para suporte",
    items: [
      "Se uma chamada autenticada falhar depois do logout, o motivo esperado no console do backend é token inativo.",
      "O endpoint remove o cookie no navegador, mas clientes que usam Authorization precisam descartar o token localmente.",
    ],
  },
];

export default function LogoutTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Este fluxo encerra a sessão do usuário ao inativar o token usado na autenticação e remover o cookie do navegador."
      title="Logout"
    />
  );
}
