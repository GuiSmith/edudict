import WikiTabContent from "./WikiTabContent";

const blocks = [
  {
    title: "Objetivo e acesso",
    items: [
      "O módulo permite estimar uma tendência de aprovação ou risco de reprovação a partir dos dados acadêmicos e contextuais informados no formulário.",
      "Usuários autenticados e visitantes podem gerar predições. Visitantes são identificados pelo guest_session_id criado no navegador.",
      "Cada pessoa visualiza somente o histórico associado ao seu usuário ou à sua sessão visitante.",
    ],
  },
  {
    title: "Fluxo principal",
    items: [
      "A página /predicoes apresenta o histórico e o botão Nova predição.",
      "O formulário é dividido nas etapas Estudante, Família, Estudos e suporte e Rotina.",
      "O front-end envia os dados para POST /predict.",
      "O back-end valida e normaliza o payload antes de chamar a API Python responsável pelo modelo.",
      "A resposta é persistida e devolvida ao front-end sem acionar automaticamente o agente.",
      "GET /predict lista as predições do proprietário atual, da mais recente para a mais antiga.",
    ],
  },
  {
    title: "Resultado apresentado",
    items: [
      "Os cartões informam a disciplina, a idade, o número de faltas e a tendência indicada pelo modelo.",
      "Quando disponível, o cartão apresenta a probabilidade de aprovação retornada pela API de Machine Learning.",
      "A ação Visualizar abre os dados usados na análise.",
      "A ação Analisar cria ou abre um chat vinculado à predição para que o agente explique o resultado.",
    ],
  },
  {
    title: "Explicabilidade local com SHAP",
    items: [
      "A API de Machine Learning calcula uma explicação específica para cada predição depois de gerar o resultado e as probabilidades.",
      "A resposta pode conter até cinco fatores principais, ordenados pelo impacto absoluto.",
      "Cada fator informa o campo original, o valor utilizado, a direção da contribuição e o impacto calculado.",
      "A direção increase indica que o fator contribuiu a favor do resultado previsto; decrease indica que atuou contra o resultado previsto.",
      "Essas contribuições são estatísticas e locais. Elas não demonstram causa e efeito nem garantem o desempenho futuro do estudante.",
      "A explicabilidade é usada como contexto do agente. A tela de detalhes ainda não possui uma seção visual dedicada aos fatores SHAP.",
    ],
  },
  {
    title: "Persistência e compatibilidade",
    items: [
      "Os 31 campos do formulário são persistidos na tabela predicao.",
      "A coluna aprovado guarda uma representação booleana do resultado principal.",
      "A resposta completa da API Python, incluindo explanation quando disponível, fica em resultado_predicao no formato JSON.",
      "Não foi criada uma coluna exclusiva para SHAP.",
      "Predições antigas continuam válidas mesmo sem explanation.",
      "Se o cálculo SHAP falhar, a predição é concluída normalmente e explanation fica null.",
    ],
  },
  {
    title: "Validações e suporte",
    items: [
      "G1, G2 e G3 não são aceitos como entrada.",
      "Campos ausentes, extras, categorias inválidas e valores fora dos limites são recusados antes da persistência.",
      "Falhas de comunicação, URL inválida ou timeout do serviço de Machine Learning retornam erro de integração.",
      "Uma predição bem-sucedida gera log_app de INSERT para a tabela predicao e também fica registrada no log_api.",
      "Para investigar uma explicação ausente, o suporte deve confirmar primeiro se a predição e as probabilidades foram retornadas normalmente.",
    ],
  },
];

export default function PredicoesTab() {
  return (
    <WikiTabContent
      blocks={blocks}
      description="Este módulo coleta os dados, consulta a API de Machine Learning, persiste o resultado e fornece fatores locais para apoiar a interpretação."
      title="Predições e explicabilidade"
    />
  );
}
