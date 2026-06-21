import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "O que está implementado",
    items: [
      "Predições acadêmicas para usuários autenticados e visitantes, com formulário em etapas e histórico individual.",
      "Integração com uma API Python que retorna resultado, probabilidades e explicabilidade local SHAP.",
      "Persistência da resposta completa da predição, incluindo os fatores SHAP quando disponíveis.",
      "Chats vinculados opcionalmente a predições, com histórico de mensagens e interpretação pelo agente inteligente.",
      "Contexto controlado para que o agente use fatores locais sem inventar justificativas ou afirmar causalidade.",
      "Login por CPF ou e-mail, com criação de token persistido no banco.",
      "Logout com inativação do token utilizado na autenticação.",
      "Criação de usuário autenticada, com validação estrutural e registro em log_app.",
      "Edição parcial de usuário autenticada, com validação estrutural, unicidade de CPF/e-mail e registro em log_app.",
    ],
  },
  {
    title: "Como ler esta wiki",
    items: [
      "As regras descritas aqui foram extraídas das rotas, controllers, DTOs, services, middlewares e OpenAPI existentes.",
      "Quando uma funcionalidade aparece apenas como prevista na documentação central, ela fica separada das funcionalidades prontas.",
      "O log_app é tratado como auditoria de alteração de registros do banco, enquanto o log_api registra contexto HTTP e resultado de requisições.",
    ],
  },
];

export default function VisaoGeralTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Esta página documenta os módulos disponíveis no EduDict, desde a geração da predição até sua interpretação no chat."
      title="Wiki funcional do edudict"
    />
  );
}
