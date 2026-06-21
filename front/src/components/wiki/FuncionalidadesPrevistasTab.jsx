import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Gestão administrativa de usuários",
    items: [
      "Ainda não existe uma rota ou tela para listar todos os usuários.",
      "Ainda não existe uma ação dedicada de inativação; o campo ativo pode ser alterado somente pelo fluxo geral de edição.",
      "O sistema ainda não possui perfis de permissão ou papéis de acesso.",
    ],
  },
  {
    title: "Visualização da explicabilidade",
    items: [
      "Ainda não existe uma seção visual na tela de detalhes para mostrar diretamente ao usuário os fatores SHAP.",
      "Atualmente, os fatores são persistidos e usados pelo agente durante a análise no chat.",
    ],
  },
];

export default function FuncionalidadesPrevistasTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Esta seção separa melhorias ainda não disponíveis das funcionalidades que já podem ser utilizadas."
      title="Funcionalidades previstas"
    />
  );
}
