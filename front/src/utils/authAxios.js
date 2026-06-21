import axios from "axios";

const GUEST_SESSION_STORAGE_KEY = "guest_session_id";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getGuestSessionId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedGuestSessionId = window.localStorage.getItem(
    GUEST_SESSION_STORAGE_KEY
  );

  if (storedGuestSessionId && UUID_PATTERN.test(storedGuestSessionId)) {
    return storedGuestSessionId;
  }

  const guestSessionId = window.crypto.randomUUID();
  window.localStorage.setItem(GUEST_SESSION_STORAGE_KEY, guestSessionId);

  return guestSessionId;
};

const authAxios = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  const guestSessionId = getGuestSessionId();

  if (guestSessionId) {
    config.headers.set("X-Guest-Session-Id", guestSessionId);
  }

  return config;
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url !== "/auth/me" &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/usuarios/novo"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default authAxios;
