import db from "../config/database.js";

const AUTH_FAILURE_MESSAGE = "Autenticação não realizada";
const TOKEN_MAX_AGE_IN_MS = 8 * 60 * 60 * 1000;
const PUBLIC_ROUTES = [
  { method: 'GET', path: '/health' },
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/logout' },
  { method: 'POST', path: '/usuarios' },
]
const OPTIONAL_AUTH_ROUTES = [
  { method: "POST", path: "/predict" },
  { method: "GET", path: "/chats" },
  { method: "GET", path: "/mensagens" },
  { method: "POST", path: "/mensagens" },
];

const unauthorized = (res) => {
  return res.status(401).json({
    error: AUTH_FAILURE_MESSAGE,
  });
};

const getAuthorizationToken = (authorizationHeader = "") => {
  const [type, token] = authorizationHeader.trim().split(/\s+/);

  if (!type) {
    return null;
  }

  if (type.toLowerCase() === "bearer") {
    return token || null;
  }

  return authorizationHeader.trim();
};

const getCookieToken = (cookieHeader = "") => {
  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean);

  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(tokenCookie.slice("token=".length));
};

const getRequestToken = (req) => {
  const authorizationToken = getAuthorizationToken(req.get("authorization"));

  if (authorizationToken) {
    return authorizationToken;
  }

  return getCookieToken(req.get("cookie"));
};

const tokenExpirado = (token) => {
  return Date.now() - token.criado_em.getTime() > TOKEN_MAX_AGE_IN_MS;
};

const isPublicRoute = (req) => {
  return Boolean(PUBLIC_ROUTES.find(route => route.method === req.method && route.path === req.path));
}

const isOptionalAuthRoute = (req) => {
  return OPTIONAL_AUTH_ROUTES.some(
    (route) => route.method === req.method && route.path === req.path,
  );
};

const authMiddleware = async (req, res, next) => {
  try {
    const requestToken = getRequestToken(req);

    if(isPublicRoute(req)){
      return next();
    }

    if (isOptionalAuthRoute(req) && !requestToken) {
      return next();
    }

    if (!requestToken) {
      console.log("token não informado");
      return unauthorized(res);
    }

    const token = await db.token.findUnique({
      where: {
        token: requestToken,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            email: true,
            ativo: true,
          },
        },
      },
    });

    if (!token) {
      console.log("token não encontrado no banco de dados");
      return unauthorized(res);
    }

    if (tokenExpirado(token)) {
      console.log("token expirado");
      return unauthorized(res);
    }

    if (!token.ativo) {
      console.log("token inativo");
      return unauthorized(res);
    }

    req.user = token.usuario;

    return next();
  } catch (error) {
    console.log("erro inesperado durante autenticação", error);
    return unauthorized(res);
  }
};

export default authMiddleware;
