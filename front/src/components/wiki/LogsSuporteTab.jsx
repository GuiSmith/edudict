import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "log_api",
    items: [
      "Registra contexto HTTP da requisição e da resposta.",
      "Guarda método, rota, URL original, status code, IP, user-agent, params, query, body sanitizado e response body quando possível.",
      "Marca erro quando o status final é 400 ou superior.",
      "Não registra a rota /health.",
    ],
  },
  {
    title: "log_app",
    items: [
      "Registra alteração de registro persistido no banco.",
      "Não deve guardar sucesso, falha, motivo de rejeição, status HTTP ou contexto de requisição.",
      "No login e logout, a entidade auditada é token.",
      "Na criação e edição de usuário, a entidade auditada é usuario.",
      "Na criação de uma predição, a entidade auditada é predicao e o resultado completo fica disponível no campo depois.",
    ],
  },
  {
    title: "Pontos de atenção",
    items: [
      "Para investigar falha de login, comece pelo log_api, porque login inválido não altera banco.",
      "Para auditar criação ou inativação de token, consulte log_app filtrando tabela token.",
      "Para auditar criação de usuário, consulte log_app filtrando tabela usuario e operação INSERT.",
      "Para auditar edição de usuário, consulte log_app filtrando tabela usuario e operação UPDATE.",
      "Para auditar uma predição, consulte log_app filtrando tabela predicao e operação INSERT.",
      "Quando a explicabilidade estiver disponível, ela aparece dentro de resultado_predicao.explanation no registro persistido.",
    ],
  },
];

export default function LogsSuporteTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Login, logout, criação de usuário e edição de usuário geram trilhas diferentes entre log_api e log_app."
      title="Logs e suporte técnico"
    />
  );
}
