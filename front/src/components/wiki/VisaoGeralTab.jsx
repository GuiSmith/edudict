import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "O que está implementado",
    items: [
      "Login por CPF ou e-mail, com criação de token persistido no banco.",
      "Logout com inativação do token utilizado na autenticação.",
      "Criação de usuário autenticada, com validação estrutural e registro em log_app.",
    ],
  },
  {
    title: "Como ler esta wiki",
    items: [
      "As regras descritas aqui foram extraídas das rotas, controllers, DTOs, services, middlewares e OpenAPI existentes.",
      "Quando uma funcionalidade aparece apenas como prevista na fonte de verdade, ela fica separada das funcionalidades prontas.",
      "O log_app é tratado como auditoria de alteração de registros do banco, enquanto o log_api registra contexto HTTP e resultado de requisições.",
    ],
  },
];

export default function VisaoGeralTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Esta página documenta os fluxos de autenticação e usuários que já existem no código atual da aplicação."
      title="Wiki funcional do Stocky"
    />
  );
}
