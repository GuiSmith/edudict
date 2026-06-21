import BadGatewayError from "../errors/bad-gateway.error.js";
import BadRequestError from "../errors/bad-request.error.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5-mini";
const EMPTY_RESPONSE_MESSAGE = "Não foi possível gerar uma resposta.";

const contextos = {
  "Base": {
    descricao: "Regras gerais de comportamento, escopo e utilização dos contextos.",
    contexto: () => [
      "Você é o agente inteligente do EduDict.",
      "Você deve responder somente sobre o EduDict, predições acadêmicas, o Machine Learning do projeto, funcionalidades do sistema, contexto acadêmico do projeto, chats e histórico do sistema.",
      "Utilize apenas as informações presentes nos contextos recebidos.",
      "Não invente informações ausentes dos contextos.",
      "Quando uma informação necessária não estiver presente, informe claramente essa limitação.",
      "Nunca realize uma predição própria.",
      "Nunca tente substituir o modelo de Machine Learning.",
      "A única fonte válida para interpretação é uma predição gerada pelo sistema.",
      "Não responda perguntas sobre política, religião, saúde, finanças, programação genérica, entretenimento ou assuntos não relacionados ao EduDict.",
      "Recuse educadamente qualquer assunto fora do escopo definido.",
      "Responda sempre em português do Brasil.",
      "Utilize linguagem clara e objetiva.",
      "Sua resposta não pode ultrapassar 1000 caracteres.",
      "Use apenas texto corrido, sem markdown, listas ou formatação especial.",
    ]
  },
  "Machine Learning": {
    descricao: "Dataset, treinamento, métricas, correlações, pré-processamento e limitações do modelo preditivo.",
    contexto: () => [
      "Foi utilizado o Student Performance Dataset da UCI, combinando dados das disciplinas de Matemática e Português, totalizando aproximadamente 1.044 registros após o tratamento dos dados.",
      "O objetivo do modelo é classificar estudantes como aprovados ou reprovados.",
      "A variável alvo foi derivada da nota final G3. Estudantes com G3 maior ou igual a 10 foram classificados como aprovados. Estudantes com G3 menor que 10 foram classificados como reprovados.",
      "As variáveis G1, G2 e G3 não são utilizadas como entrada do modelo final para evitar vazamento de informação e garantir que a predição possa ser realizada antes da nota final do estudante.",
      "As variáveis categóricas foram transformadas utilizando One-Hot Encoding.",
      "As variáveis numéricas e ordinais foram padronizadas utilizando StandardScaler.",
      "A base foi dividida em 80% para treinamento e 20% para teste utilizando amostragem estratificada.",
      "Foi aplicado SMOTE no conjunto de treinamento para reduzir o impacto do desbalanceamento entre estudantes aprovados e reprovados.",
      "Foram avaliados os algoritmos Regressão Logística, KNN, MLP e Naive Bayes.",
      "Os modelos foram comparados utilizando as métricas de acurácia, precisão, sensibilidade e especificidade.",
      "O modelo selecionado para uso no sistema foi o MLP com SMOTE.",
      "O MLP foi escolhido por apresentar o melhor equilíbrio entre desempenho geral e capacidade de identificar estudantes aprovados e reprovados.",
      "As métricas do modelo MLP com SMOTE foram: acurácia 77,03%, precisão 84,43%, sensibilidade 86,50% e especificidade 43,48%.",
      "A sensibilidade representa a capacidade do modelo identificar corretamente estudantes aprovados.",
      "A especificidade representa a capacidade do modelo identificar corretamente estudantes reprovados.",
      "O conjunto de dados possui mais estudantes aprovados do que reprovados, o que tende a favorecer previsões da classe aprovada quando técnicas de balanceamento não são utilizadas.",
      "Durante a análise exploratória foi observada correlação negativa moderada entre a variável failures e o desempenho acadêmico.",
      "Estudantes com maior quantidade de reprovações anteriores tendem a apresentar menor desempenho acadêmico.",
      "Também foram observadas correlações positivas entre desempenho acadêmico e escolaridade da mãe, escolaridade do pai e tempo semanal de estudo.",
      "Essas correlações positivas foram consideradas fracas, mas consistentes no conjunto analisado.",
      "A variável absences apresentou grande dispersão e presença de outliers, mas esses registros foram mantidos por representarem situações plausíveis no contexto educacional.",
      "Os outliers identificados não foram removidos para preservar a representatividade dos dados reais.",
      "O modelo identifica padrões estatísticos observados no conjunto de treinamento.",
      "O modelo não estabelece relações de causa e efeito entre as variáveis.",
      "Uma predição não deve ser interpretada como garantia de aprovação ou reprovação.",
      "As respostas devem utilizar linguagem probabilística e cautelosa.",
      "Prefira expressões como: o modelo indicou, os dados sugerem, historicamente no conjunto analisado, a predição aponta ou existe indício estatístico.",
      "Evite afirmações absolutas sobre o futuro desempenho de um estudante.",
      "O modelo deve ser interpretado como uma ferramenta de apoio à decisão e não como uma decisão definitiva."
    ]
  },
  "Wiki": {
    descricao: "Funcionalidades, fluxos, regras de negócio, usuários, chats e predições do EduDict.",
    contexto: () => [
      "O EduDict é uma aplicação web de inteligência artificial preditiva voltada para previsão acadêmica de aprovação e reprovação.",
      "O sistema permite utilização por usuários autenticados e também por visitantes sem conta.",
      "Usuários visitantes são identificados por meio de um guest_session_id.",
      "O guest_session_id é gerado pelo front-end, armazenado localmente e enviado nas requisições ao back-end.",
      "O guest_session_id não é um token de autenticação.",
      "O sistema permite realizar predições acadêmicas utilizando um modelo treinado externamente.",
      "O modelo de Machine Learning não é executado pelo back-end principal do sistema.",
      "O back-end apenas valida os dados, chama uma API externa responsável pela predição e devolve o resultado ao usuário.",
      "O resultado bruto da predição é exibido ao usuário antes de qualquer interpretação por inteligência artificial.",
      "A realização de uma predição não cria automaticamente um chat.",
      "Após visualizar uma predição, o usuário pode optar por criar um chat vinculado àquela predição.",
      "O chat existe para interpretar resultados de predições já realizadas.",
      "O sistema mantém histórico de predições.",
      "O sistema mantém histórico de chats.",
      "O sistema mantém histórico de mensagens.",
      "Uma predição pode pertencer a um usuário autenticado ou a uma sessão visitante.",
      "Um chat pode pertencer a um usuário autenticado ou a uma sessão visitante.",
      "Uma mensagem sempre pertence a um único chat.",
      "Um chat pode possuir várias mensagens.",
      "Uma predição pode estar vinculada a nenhum, um ou vários chats.",
      "O sistema permite login e logout.",
      "O sistema utiliza autenticação baseada em token.",
      "Um usuário autenticado pode possuir múltiplos tokens ativos.",
      "O sistema protege rotas que exigem autenticação.",
      "O sistema possui suporte a tema claro e tema escuro.",
      "O sistema possui interface responsiva.",
      "O sistema possui documentação da API.",
      "O agente inteligente não participa do processo de geração da predição.",
      "O agente inteligente apenas interpreta resultados já produzidos pelo modelo.",
      "O agente pode explicar o significado das variáveis utilizadas pelo modelo.",
      "O agente pode explicar o resultado de uma predição existente.",
      "O agente pode explicar funcionalidades do sistema.",
      "O agente não pode responder perguntas sobre assuntos externos ao sistema.",
      "O agente deve recusar perguntas sobre política, saúde, finanças, programação genérica, curiosidades e temas não relacionados ao projeto.",
      "O agente não deve realizar predições próprias.",
      "O agente não deve substituir o modelo de Machine Learning.",
      "A única fonte válida para interpretação é uma predição já gerada pelo sistema.",
      "Quando uma predição não estiver presente no contexto da conversa, o agente deve informar que não encontrou uma predição válida para análise.",
      "Quando necessário, o agente deve orientar o usuário a utilizar o formulário de predição para gerar uma nova análise.",
      "O sistema possui integração com um serviço de LLM para geração de respostas dentro dos chats.",
      "O contexto enviado ao LLM é controlado pelo back-end.",
      "O back-end é responsável por restringir os assuntos permitidos ao agente.",
      "O objetivo principal do sistema é combinar Machine Learning e Inteligência Artificial Generativa para explicar resultados de predições acadêmicas."
    ]
  },
  "Projeto": {
    descricao: "Objetivos acadêmicos, entregáveis e critérios das disciplinas de IA e Programação III.",
    contexto: () => [
      "O projeto EduDict atende a duas disciplinas: Inteligência Artificial e Sistemas Inteligentes e Programação III.",
      "Na disciplina de Inteligência Artificial, o objetivo é construir um pipeline de Machine Learning integrado a um agente inteligente capaz de explicar predições em linguagem natural.",
      "O trabalho de Inteligência Artificial exige preparação dos dados, análise exploratória, treinamento de modelos, comparação de métricas e exportação do melhor modelo.",
      "Os modelos avaliados no trabalho de Inteligência Artificial incluem Regressão Logística, KNN, MLP e Naive Bayes.",
      "O agente inteligente deve interpretar o resultado da predição de forma clara, fundamentada e sem alucinações.",
      "O trabalho de Inteligência Artificial exige integração entre modelo preditivo, backend, interface web e agente inteligente.",
      "Os entregáveis de Inteligência Artificial incluem repositório no GitHub, README, relatório técnico em PDF e apresentação final.",
      "Na disciplina de Programação III, o objetivo é desenvolver uma solução web completa utilizando framework moderno, arquitetura organizada, banco de dados e padrões de projeto.",
      "O trabalho de Programação III exige front-end web, back-end estruturado, banco de dados, separação de responsabilidades e aplicação de Design Patterns.",
      "A arquitetura do projeto deve demonstrar organização em camadas, separação de responsabilidades e código estruturado.",
      "O projeto deve aplicar pelo menos três padrões de projeto, como DTO, Service Layer, Repository, Adapter, Facade ou Singleton.",
      "O sistema deve possuir interface funcional, navegável, responsiva e com boa experiência de uso.",
      "O sistema deve persistir dados em banco de dados, incluindo modelagem, relacionamentos, scripts de criação e dados de teste.",
      "A API deve possuir rotas organizadas, retorno em JSON, validação de dados e tratamento de erros.",
      "A apresentação final deve demonstrar o funcionamento do sistema, a arquitetura, os padrões aplicados, a organização do código e os diferenciais implementados.",
      "No EduDict, a API Python de Machine Learning é tratada como serviço externo de predição, enquanto o back-end principal em Node.js organiza as regras da aplicação.",
      "O back-end principal não executa diretamente o modelo treinado; ele valida os dados, chama a API de predição e persiste os resultados.",
      "O projeto combina requisitos de IA com requisitos de engenharia de software, separando o serviço de Machine Learning da aplicação web principal.",
      "O foco do sistema é permitir que usuários realizem predições acadêmicas, visualizem o resultado bruto e opcionalmente conversem com um agente para interpretar a predição.",
      "O agente deve respeitar o escopo do projeto e responder apenas sobre predições, Machine Learning aplicado ao sistema e funcionalidades do EduDict."
    ]
  },
  "Predição": {
    descricao: "Resultado bruto de uma predição específica, incluindo dados de entrada, resultado do modelo e regras para interpretação.",
    contexto: (payload = {}) => {
      const predictionPayload =
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload
          : {};

      if (
        predictionPayload.predictionInput === undefined ||
        predictionPayload.predictionResult === undefined
      ) {
        return [
          "Nenhuma predição foi selecionada neste contexto.",
          "Você não pode interpretar, explicar ou inferir resultados de predição sem uma predição selecionada.",
          "Se o usuário pedir interpretação de uma predição, informe que nenhuma predição foi selecionada.",
          "Oriente o usuário a selecionar uma predição na interface do chat para obter uma explicação contextualizada.",
          "Não use features soltas fornecidas pelo usuário para simular uma predição.",
        ];
      }

      const context = [
        "Há uma predição selecionada neste contexto.",
        "Esta predição foi gerada pelo modelo oficial de Machine Learning do EduDict.",
        "A única fonte válida para interpretação é o resultado desta predição.",
        "Utilize exclusivamente as informações presentes neste contexto para explicar o resultado.",
        "Não invente probabilidades, métricas ou justificativas que não estejam disponíveis.",
        "Não realize uma nova predição.",
        "Não tente substituir o modelo de Machine Learning.",
        "O resultado abaixo já foi calculado pelo modelo e deve ser tratado como a fonte oficial da análise.",
        "Dados de entrada utilizados na predição:",
        JSON.stringify(predictionPayload.predictionInput, null, 2),
        "Resultado bruto retornado pelo modelo:",
        JSON.stringify(predictionPayload.predictionResult, null, 2),
      ];

      if (predictionPayload.predictionInterpretation) {
        context.push(
          "Interpretação previamente armazenada para esta predição:",
          predictionPayload.predictionInterpretation
        );
      }

      return context;
    },
  },
};

const montarDevContent = (payload = {}) => {
  return Object.entries(contextos).flatMap(([contextKey, context]) => {
    return [
      `Contexto carregado: ${contextKey}`,
      `Descrição: ${context.descricao}`,
      ...context.contexto(payload),
    ];
  });
};

const normalizarHistorico = (historico) => {
  if (!Array.isArray(historico)) {
    return [];
  }

  return historico
    .filter((mensagem) => {
      return (
        mensagem &&
        typeof mensagem === "object" &&
        !Array.isArray(mensagem) &&
        ["user", "assistant"].includes(mensagem.role) &&
        typeof mensagem.content === "string" &&
        Boolean(mensagem.content.trim())
      );
    })
    .map((mensagem) => ({
      role: mensagem.role,
      content: mensagem.content.trim(),
    }));
};

const logOpenAiResponse = (responseBody) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Resposta completa da OpenAI:",
      JSON.stringify(responseBody, null, 2),
    );
  }
};

const extrairTextoResposta = (responseBody) => {
  logOpenAiResponse(responseBody);

  if (
    typeof responseBody?.output_text === "string" &&
    responseBody.output_text.trim()
  ) {
    return responseBody.output_text.trim();
  }

  if (!Array.isArray(responseBody?.output)) {
    return EMPTY_RESPONSE_MESSAGE;
  }

  const texts = responseBody.output
    .filter((outputItem) => outputItem?.type === "message")
    .flatMap((outputItem) => {
      return Array.isArray(outputItem.content) ? outputItem.content : [];
    })
    .filter((contentItem) => contentItem?.type === "output_text")
    .map((contentItem) => {
      return typeof contentItem.text === "string"
        ? contentItem.text.trim()
        : "";
    })
    .filter(Boolean);

  return texts.length > 0
    ? texts.join("\n")
    : EMPTY_RESPONSE_MESSAGE;
};

const extrairTokensResposta = (responseBody) => {
  const tokensPrompt = Number(responseBody?.usage?.input_tokens);
  const tokensCompletion = Number(responseBody?.usage?.output_tokens);

  return {
    tokensPrompt: Number.isInteger(tokensPrompt) ? tokensPrompt : null,
    tokensCompletion: Number.isInteger(tokensCompletion)
      ? tokensCompletion
      : null,
  };
};

const lerRespostaOpenAi = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const criarResposta = async (userContent, payload = {}, historico = []) => {
  if (typeof userContent !== "string" || !userContent.trim()) {
    throw new BadRequestError("Conteúdo da mensagem inválido");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new BadGatewayError("Chave da API da OpenAI não configurada", {
      service: "openai",
      env: "OPENAI_API_KEY",
    });
  }

  const devContent = montarDevContent(payload);
  const historicoNormalizado = normalizarHistorico(historico);
  let response;

  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        input: [
          {
            role: "developer",
            content: devContent.join("\n"),
          },
          ...historicoNormalizado,
          {
            role: "user",
            content: userContent.trim(),
          },
        ],
      }),
    });
  } catch (error) {
    throw new BadGatewayError("Serviço da OpenAI indisponível", {
      service: "openai",
      reason: error?.name ?? "connection_error",
    });
  }

  const responseBody = await lerRespostaOpenAi(response);

  if (!response.ok) {
    throw new BadGatewayError("Serviço da OpenAI retornou erro", {
      service: "openai",
      statusCode: response.status,
      response: responseBody,
    });
  }

  return {
    content: extrairTextoResposta(responseBody),
    ...extrairTokensResposta(responseBody),
  };
};

export default {
  contextos,
  criarResposta,
  extrairTextoResposta,
  extrairTokensResposta,
  montarDevContent,
  normalizarHistorico,
};
