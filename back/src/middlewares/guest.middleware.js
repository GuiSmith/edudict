import NotAuthorizedError from "../errors/not-authorized.error.js";

const REQUIRED_ROUTES = [
  { method: 'POST', 'path': '/predict' },
  { method: 'GET', 'path': '/predict' },
  { method: 'GET', 'path': '/chats' },
  { method: 'GET', 'path': '/mensagens' },
  { method: 'POST', 'path': '/mensagens' },
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isRequiredRoute = (req) => {
  return REQUIRED_ROUTES.some(route => route.method === req.method && route.path === req.path);
}

const guestMiddleware = (req, res, next) => {

  if(!isRequiredRoute(req)){
    return next();
  }

  console.log({ user: req?.user });

  if (req.user) {
    return next();
  }

  const guestSessionId = req.get("x-guest-session-id")?.trim();

  if (!guestSessionId || !UUID_PATTERN.test(guestSessionId)) {
    throw new NotAuthorizedError(
      "Autenticação ou sessão de convidado não realizada. Contate o suporte",
    );
  }

  req.guest_session_id = guestSessionId;

  return next();
};

export default guestMiddleware;
