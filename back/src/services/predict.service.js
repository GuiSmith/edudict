import BadGatewayError from "../errors/bad-gateway.error.js";
import BadRequestError from "../errors/bad-request.error.js";

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

const predict = async (predictionDTO) => {
  let response;
  const baseUrl = process.env.STUDENT_APPROVAL_API_URL;
  let predictUrl;

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
