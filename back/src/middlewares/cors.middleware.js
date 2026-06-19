const ALLOWED_HOSTS = ["localhost", "127.0.0.1"];
const ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const ALLOWED_HEADERS = "Content-Type,Authorization,X-Guest-Session-Id";

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return false;
  }

  try {
    const { hostname } = new URL(origin);

    return ALLOWED_HOSTS.includes(hostname);
  } catch (error) {
    return false;
  }
};

const corsMiddleware = (req, res, next) => {
  const origin = req.get("origin");

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
    res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }

  return next();
};

export default corsMiddleware;
