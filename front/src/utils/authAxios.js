import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:3011",
  withCredentials: true,
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default authAxios;
