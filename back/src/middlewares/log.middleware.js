import db from "../config/database.js";

const SENSITIVE_FIELDS = ["password", "senha"];
const IGNORED_BODY_CONTENT_TYPES = [
  "multipart/form-data",
  "application/octet-stream",
];
const IGNORED_ROUTES = ["/health"];

const isPlainObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!isPlainObject(value)) {
    return value ?? null;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, currentValue]) => {
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        return [key, "[removido]"];
      }

      return [key, sanitizeValue(currentValue)];
    })
  );
};

const getRequestBody = (req) => {
  const contentType = req.get("content-type") ?? "";
  const shouldIgnoreBody = IGNORED_BODY_CONTENT_TYPES.some((ignoredContentType) =>
    contentType.includes(ignoredContentType)
  );

  if (shouldIgnoreBody) {
    return "[conteúdo não registrado]";
  }

  return sanitizeValue(req.body);
};

const getRoute = (req) => {
  if (!req.route?.path) {
    return req.path;
  }

  return `${req.baseUrl}${req.route.path}`;
};

const getErrorMessage = (responseBody) => {
  if (!responseBody || !isPlainObject(responseBody)) {
    return null;
  }

  return responseBody.error ?? responseBody.message ?? null;
};

const logMiddleware = (req, res, next) => {
  if (IGNORED_ROUTES.includes(req.path)) {
    return next();
  }

  const startedAt = Date.now();
  const originalJson = res.json.bind(res);
  let responseBody = null;

  res.json = (body) => {
    responseBody = sanitizeValue(body);

    return originalJson(body);
  };

  res.on("finish", async () => {
    const statusCode = res.statusCode;

    try {
      await db.log_api.create({
        data: {
          metodo: req.method,
          rota: getRoute(req),
          url_original: req.originalUrl,
          status_code: statusCode,
          ip: req.ip,
          user_agent: req.get("user-agent") || null,
          referer: req.get("referer") || null,
          params: sanitizeValue(req.params),
          query: sanitizeValue(req.query),
          body: getRequestBody(req),
          response_body: responseBody,
          response_time_ms: Date.now() - startedAt,
          id_usuario: req.user?.id ?? null,
          erro: statusCode >= 400,
          erro_mensagem: statusCode >= 400 ? getErrorMessage(responseBody) : null,
        },
      });
    } catch (error) {
      console.error("Erro ao registrar log da API", error);
    }
  });

  return next();
};

export default logMiddleware;
