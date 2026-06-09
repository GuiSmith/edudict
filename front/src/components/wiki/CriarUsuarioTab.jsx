import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Endpoint e autenticação",
    items: [
      "Rota: POST /usuarios.",
      "A rota é protegida pelo middleware de autenticação global.",
      "O usuário autenticado fica disponível em req.user e seu id é usado como responsável no log_app.",
    ],
  },
  {
    title: "Campos de entrada",
    items: [
      "Campos obrigatórios: nome, cpf, email e senha.",
      "O campo ativo é opcional e, quando não enviado, assume true.",
      "O CPF é normalizado removendo tudo que não for número e precisa ficar com 11 dígitos.",
      "O e-mail é convertido para string, recebe trim e precisa obedecer ao formato básico de e-mail.",
    ],
  },
  {
    title: "Fluxo principal",
    items: [
      "O controller valida o payload com o DTO de criação de usuário.",
      "O service abre uma transação antes das leituras de CPF e e-mail.",
      "O sistema verifica se CPF ou e-mail já existem.",
      "A senha é criptografada com bcrypt antes de ser persistida.",
      "Depois do insert, o retorno remove a senha e envia id, nome, cpf, email e ativo.",
    ],
  },
  {
    title: "Regras de negócio identificadas",
    items: [
      "CPF e e-mail são únicos na tabela usuario.",
      "Se CPF ou e-mail já estiverem cadastrados, a criação é bloqueada com conflito.",
      "A senha persistida é o hash, nunca o texto recebido no payload.",
      "A criação de usuário participa da mesma transação do log_app.",
    ],
  },
  {
    title: "Efeitos no banco e logs",
    items: [
      "Cria um registro na tabela usuario.",
      "Registra log_app com operação INSERT apontando para a tabela usuario.",
      "No log_app, depois contém os dados públicos do usuário criado.",
      "O campo senha é removido dos dados retornados e também sanitizado quando passa pelos logs.",
    ],
  },
  {
    title: "Erros e validações",
    items: [
      "Campos obrigatórios ausentes retornam bad request com a lista de fields.",
      "CPF inválido retorna erro específico para cpf.",
      "E-mail inválido retorna erro específico para email.",
      "CPF ou e-mail duplicado retorna conflito com fields indicando quais campos já existem.",
    ],
  },
];

export default function CriarUsuarioTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Este fluxo cadastra um usuário novo e retorna apenas os dados públicos do cadastro."
      title="Criação de usuário"
    />
  );
}
