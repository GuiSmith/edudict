import loginDTO from "../dtos/auth/login.dto.js";
import authService from "../services/auth.service.js";

const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000;

const isSecureRequest = (req) => {
  return (
    req.secure ||
    req.get("x-forwarded-proto") === "https" ||
    process.env.NODE_ENV === "production"
  );
};

const getTokenCookieOptions = (req) => ({
  httpOnly: true,
  secure: isSecureRequest(req),
  sameSite: "lax",
  path: "/",
});

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

const login = async (req, res) => {
  const dto = loginDTO(req.body);
  const autenticacao = await authService.login(dto);

  res.cookie("token", autenticacao.token, {
    ...getTokenCookieOptions(req),
    maxAge: COOKIE_MAX_AGE,
  });

  return res.status(200).json({
    usuario: autenticacao.usuario,
  });
};

const verificarAutenticacao = async (req, res) => {
  return res.status(200).json(req.user);
};

const logout = async (req, res) => {
  await authService.logout(getRequestToken(req));

  res.clearCookie("token", getTokenCookieOptions(req));

  return res.status(204).send();
};

export default {
  login,
  verificarAutenticacao,
  logout,
};
