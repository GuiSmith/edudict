import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Objetivo do módulo",
    items: [
      "O chat permite conversar com o agente do EduDict e interpretar uma predição já calculada.",
      "O agente não cria novas predições e não substitui o modelo de Machine Learning.",
      "Um chat pode estar vinculado a uma predição ou existir sem uma predição selecionada.",
    ],
  },
  {
    title: "Criação e histórico",
    items: [
      "A ação Analisar no histórico de predições abre /chat com o identificador da predição e envia uma solicitação inicial de análise.",
      "Ao enviar a primeira mensagem sem id_chat, o back-end cria o chat e usa os primeiros 25 caracteres da mensagem como título.",
      "Quando id_predicao é informado, a predição precisa pertencer ao mesmo usuário ou à mesma sessão visitante.",
      "GET /chats lista o histórico de chats e GET /mensagens lista as mensagens de um chat autorizado.",
    ],
  },
  {
    title: "Contexto enviado ao agente",
    items: [
      "O back-end envia os dados originais da predição em predictionInput.",
      "O resultado bruto, as probabilidades e a explicabilidade SHAP seguem em predictionResult.",
      "Quando explanation existe, ela também recebe destaque explícito no contexto de desenvolvimento do agente.",
      "O histórico anterior do chat é normalizado e enviado junto da nova mensagem.",
      "Se nenhuma predição estiver selecionada, o agente é instruído a não simular ou inventar uma análise.",
    ],
  },
  {
    title: "Como o agente usa SHAP",
    items: [
      "O agente deve priorizar os fatores retornados pelo SHAP ao explicar uma predição.",
      "Ele não pode inventar fatores adicionais, probabilidades, pesos ou justificativas ausentes.",
      "A linguagem deve indicar contribuição estatística, sem afirmar causalidade.",
      "Increase é explicado como contribuição a favor do resultado previsto; decrease como contribuição contra o resultado.",
      "Detalhes como arquitetura do modelo, balanceamento e métricas de treinamento não devem aparecer espontaneamente.",
      "Quando a predição já está vinculada ao chat, o agente não orienta o usuário a criar ou selecionar outro chat.",
    ],
  },
  {
    title: "Limites e persistência",
    items: [
      "Cada chat aceita no máximo 10 mensagens do usuário.",
      "A mensagem do usuário pode ter até 500 caracteres e a resposta persistida do agente até 1.000 caracteres.",
      "Mensagens do usuário e do agente são salvas na tabela chat_mensagem.",
      "Quando disponíveis, os consumos de tokens de entrada e saída são persistidos junto da resposta.",
      "O agente responde somente sobre o EduDict, predições acadêmicas, o modelo do projeto e suas funcionalidades.",
    ],
  },
  {
    title: "Observações para suporte",
    items: [
      "Se o agente disser que não há predição selecionada, verifique se o chat possui id_predicao.",
      "Se a resposta não usar fatores locais, verifique se resultado_predicao.explanation existe no registro vinculado.",
      "Predições antigas ou falhas isoladas do SHAP podem ter explanation null; nesse caso, o agente ainda pode explicar o resultado e as probabilidades sem inventar fatores.",
      "Erros do serviço de linguagem são tratados como falha de integração e não alteram a predição já persistida.",
    ],
  },
];

export default function ChatAgenteTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="O agente recebe somente o contexto controlado pelo back-end e usa a explicabilidade local para produzir uma interpretação cautelosa."
      title="Chat e agente inteligente"
    />
  );
}
