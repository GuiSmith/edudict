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
      "Na criação de usuário, a entidade auditada é usuario.",
    ],
  },
  {
    title: "Pontos de atenção",
    items: [
      "Para investigar falha de login, comece pelo log_api, porque login inválido não altera banco.",
      "Para auditar criação ou inativação de token, consulte log_app filtrando tabela token.",
      "Para auditar criação de usuário, consulte log_app filtrando tabela usuario e operação INSERT.",
    ],
  },
];

export default function LogsSuporteTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Login, logout e criação de usuário geram trilhas diferentes entre log_api e log_app."
      title="Logs e suporte técnico"
    />
  );
}
