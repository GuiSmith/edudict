import BadGatewayError from "../errors/bad-gateway.error.js";
import BadRequestError from "../errors/bad-request.error.js";
import db from "../config/database.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import { criarLog } from "./log-app.service.js";

const getPredictUrl = (baseUrl) => {
  return new URL("/predict", baseUrl).toString();
};

const parseResponseBody = async (response) => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
};

const fetchPrediction = async (url, predictionDTO) => {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predictionDTO),
      signal: AbortSignal.timeout(Number(process.env.STUDENT_APPROVAL_TIMEOUT_IN_MS)),
    });
  } catch (error) {
    return error;
  }
};

const formatarPredicaoParaLog = (predicao) => {
  return {
    ...predicao,
    data_hora_criacao: predicao.data_hora_criacao.toISOString(),
  };
};

const persistirPredicao = async (
  predictionDTO,
  predictionResult,
  { usuarioId, guestSessionId },
) => {
  return db.$transaction(async (tx) => {
    const predicao = await tx.predicao.create({
      data: {
        ...predictionDTO,
        id_usuario: usuarioId,
        guest_session_id: guestSessionId,
        aprovado: predictionResult.prediction === 1,
        resultado_predicao: predictionResult,
      },
    });

    await criarLog(tx, {
      id_usuario: usuarioId,
      tabela: "predicao",
      id_tabela: predicao.id,
      operacao: "INSERT",
      depois: formatarPredicaoParaLog(predicao),
    });

    return predicao;
  });
};

const predict = async (
  predictionDTO,
  { usuarioId = null, guestSessionId = null } = {},
) => {
  let response;
  const baseUrl = process.env.STUDENT_APPROVAL_API_URL;
  let predictUrl;

  if (!usuarioId && !guestSessionId) {
    throw new NotAuthorizedError(
      "Autenticação ou sessão de convidado não realizada",
    );
  }

  if (!baseUrl) {
    throw new BadGatewayError("URL do serviço de predição não configurada", {
      service: "student-approval",
      env: "STUDENT_APPROVAL_API_URL",
    });
  }

  if (!process.env.STUDENT_APPROVAL_TIMEOUT_IN_MS) {
    throw new BadGatewayError("Timeout do serviço de predição não configurado", {
      service: "student-approval",
      env: "STUDENT_APPROVAL_TIMEOUT_IN_MS",
    });
  }

  if (
    !Number.isInteger(Number(process.env.STUDENT_APPROVAL_TIMEOUT_IN_MS)) ||
    Number(process.env.STUDENT_APPROVAL_TIMEOUT_IN_MS) <= 0
  ) {
    throw new BadGatewayError("Timeout do serviço de predição inválido", {
      service: "student-approval",
      env: "STUDENT_APPROVAL_TIMEOUT_IN_MS",
      received: process.env.STUDENT_APPROVAL_TIMEOUT_IN_MS,
    });
  }

  try {
    predictUrl = getPredictUrl(baseUrl);
  } catch {
    throw new BadGatewayError("URL do serviço de predição inválida", {
      service: "student-approval",
      baseUrl,
    });
  }

  response = await fetchPrediction(predictUrl, predictionDTO);

  if (response instanceof Error || !response) {
    throw new BadGatewayError("Serviço de predição indisponível", {
      service: "student-approval",
      reason: response?.name === "TimeoutError"
        ? "timeout"
        : "connection_error",
      url: predictUrl,
    });
  }

  const responseBody = await parseResponseBody(response);

  if (response.ok) {
    await persistirPredicao(
      predictionDTO,
      responseBody,
      { usuarioId, guestSessionId },
    );

    return responseBody;
  }

  if (response.status === 400 || response.status === 422) {
    throw new BadRequestError("Dados inválidos para predição", {
      service: "student-approval",
      statusCode: response.status,
      response: responseBody,
    });
  }

  throw new BadGatewayError("Serviço de predição retornou erro", {
    service: "student-approval",
    statusCode: response.status,
    response: responseBody,
  });
};

export default {
  predict,
};
