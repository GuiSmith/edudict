import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Endpoint e entrada",
    items: [
      "Rota: POST /auth/login.",
      "Campos obrigatórios: login e password.",
      "O campo login pode ser e-mail ou CPF. Quando for CPF, o sistema remove caracteres não numéricos antes da busca.",
    ],
  },
  {
    title: "Fluxo principal",
    items: [
      "O controller valida o payload com o DTO de login antes de chamar o service.",
      "O service procura usuário por CPF normalizado e por e-mail dentro de uma transação.",
      "Se exatamente um usuário for encontrado, ele precisa estar ativo e a senha precisa bater com o hash salvo.",
      "Quando as credenciais são válidas, o sistema cria um token aleatório de 48 bytes em hexadecimal.",
      "A resposta retorna os dados públicos do usuário e define o cookie httpOnly token com duração de 8 horas.",
    ],
  },
  {
    title: "Regras de negócio identificadas",
    items: [
      "Se CPF e e-mail encontrarem usuários ao mesmo tempo, o login é considerado ambíguo e falha.",
      "Usuário inexistente, usuário inativo e senha inválida resultam em falha de autorização.",
      "A senha nunca é retornada na resposta.",
      "A autenticação pode ser usada depois via header Authorization ou cookie token.",
    ],
  },
  {
    title: "Efeitos no banco e logs",
    items: [
      "Cria um registro na tabela token com id_usuario, token, ativo=true e criado_em.",
      "Registra log_app com operação LOGIN apontando para a tabela token.",
      "No log_app, antes é null e depois contém o registro do token criado.",
      "Tentativas inválidas não criam log_app porque não alteram registro persistido; o contexto da requisição fica no log_api.",
    ],
  },
  {
    title: "Erros e validações",
    items: [
      "Campos login ou password ausentes retornam erro de bad request.",
      "Credenciais inválidas, usuário inativo ou login ambíguo retornam 401 com mensagem Não autorizado.",
      "O suporte deve observar o log_api para investigar motivo operacional de requisições com erro.",
    ],
  },
];

export default function LoginTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Este fluxo autentica um usuário por CPF ou e-mail e cria um token de sessão para as próximas requisições."
      title="Login"
    />
  );
}
