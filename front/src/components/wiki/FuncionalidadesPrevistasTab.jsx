import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Usuários",
    items: [
      "A fonte de verdade prevê listagem, edição, inativação, associação a almoxarifados e controle de permissões.",
      "No código atual, os endpoints de usuários implementados são criação via POST /usuarios e edição via PUT /usuarios.",
      "Listagem, inativação dedicada, associação a almoxarifados e controle de permissões ainda aparecem como previstos.",
    ],
  },
  {
    title: "Autenticação",
    items: [
      "A fonte de verdade cita verificação de usuário autenticado e rotas como /auth/me.",
      "No código atual, as rotas implementadas de autenticação são POST /auth/login e POST /auth/logout.",
    ],
  },
  {
    title: "Interface",
    items: [
      "A wiki usa Material UI, conforme a fonte de verdade do front-end.",
      "Os demais módulos previstos ainda não possuem páginas ou endpoints implementados no código atual.",
    ],
  },
];

export default function FuncionalidadesPrevistasTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="A fonte de verdade descreve módulos que ainda não aparecem implementados no código atual."
      title="Funcionalidades previstas"
    />
  );
}
