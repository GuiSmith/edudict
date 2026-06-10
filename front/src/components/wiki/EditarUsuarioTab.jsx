import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Endpoint e autenticação",
    items: [
      "Rota: PUT /usuarios.",
      "A rota é protegida pelo middleware de autenticação global.",
      "O id do usuário editado é recebido no body da requisição, não na URL.",
      "O usuário autenticado fica disponível em req.user e seu id é usado como responsável no log_app.",
    ],
  },
  {
    title: "Campos de entrada",
    items: [
      "Campo obrigatório: id.",
      "Campos opcionais de atualização: nome, cpf, email, senha e ativo.",
      "O sistema ignora campos fora desse contrato no DTO de edição.",
      "Na prática, a requisição precisa enviar o id e pelo menos um campo editável.",
    ],
  },
  {
    title: "Validações principais",
    items: [
      "id precisa ser um inteiro positivo.",
      "nome, quando enviado, precisa ser string, recebe trim e não pode ficar vazio.",
      "cpf, quando enviado, é normalizado removendo tudo que não for número e precisa ficar com 11 dígitos.",
      "email, quando enviado, precisa ser string, recebe trim e precisa obedecer ao formato básico de e-mail.",
      "senha, quando enviada, precisa ser string não vazia.",
      "ativo, quando enviado, precisa ser booleano real. A string false não é aceita.",
    ],
  },
  {
    title: "Fluxo principal",
    items: [
      "O controller valida e normaliza o payload com o DTO de edição antes de chamar o service.",
      "O service abre uma transação, busca o usuário atual e interrompe o fluxo se ele não existir.",
      "Quando cpf ou email são enviados, o sistema verifica conflito com outros usuários, ignorando o próprio usuário editado.",
      "A atualização é parcial e altera somente os campos enviados.",
      "Quando senha é enviada, o service criptografa com bcrypt antes de persistir.",
    ],
  },
  {
    title: "Regras de negócio identificadas",
    items: [
      "CPF e e-mail continuam únicos entre usuários.",
      "O campo ativo aceita false e não depende de checagem truthy/falsy para ser atualizado.",
      "A senha persistida é o hash, nunca o texto recebido no payload.",
      "A resposta retorna mensagem de sucesso e os dados públicos do usuário, sem senha.",
    ],
  },
  {
    title: "Efeitos no banco e logs",
    items: [
      "Atualiza um registro existente na tabela usuario.",
      "Registra log_app com operação UPDATE apontando para a tabela usuario.",
      "No log_app, antes contém o usuário antes da alteração e depois contém o usuário atualizado.",
      "Os dados registrados no log_app não incluem senha.",
    ],
  },
  {
    title: "Erros e suporte",
    items: [
      "Body sem id retorna bad request com field id.",
      "id inválido retorna bad request.",
      "Body contendo apenas id retorna bad request pedindo ao menos um campo de atualização.",
      "CPF, email, nome, senha ou ativo inválidos retornam erro específico para o campo.",
      "CPF ou e-mail pertencente a outro usuário retorna conflito.",
      "Usuário inexistente retorna not found.",
    ],
  },
];

export default function EditarUsuarioTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Este fluxo atualiza parcialmente um usuário existente e registra a alteração persistida para auditoria."
      title="Edição de usuário"
    />
  );
}
