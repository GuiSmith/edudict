import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

import authAxios from "@/utils/authAxios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshUser = useCallback(
    async () => {
      setIsAuthLoading(true);

      try {
        const response = await authAxios.get("/auth/me");

        setIsAuthenticated(true);
        setUser(response.data);

        return response.data;
      } catch (error) {
        clearAuth();

        return null;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [clearAuth]
  );

  const login = useCallback(async () => {
    return refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await authAxios.post("/auth/logout");
    } catch (error) {
      clearAuth();
    }

    clearAuth();

    if (router.pathname !== "/login") {
      router.replace("/login");
    }
  }, [clearAuth, router]);

  useEffect(() => {
    let isMounted = true;

    authAxios
      .get("/auth/me")
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setIsAuthenticated(true);
        setUser(response.data);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearAuth();
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      isAuthLoading,
      isAuthenticated,
      login,
      logout,
      user,
    }),
    [isAuthLoading, isAuthenticated, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
