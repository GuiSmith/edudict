import "@/styles/globals.css";
import "@scalar/api-reference-react/style.css";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import NavbarLayout from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/contexts/ThemeContext";

const MAIN_ROUTE = "/";

const isPublicRoute = (pathname) => {
  return pathname === "/" || pathname === "/docs/api" || pathname.startsWith("/docs/wiki");
};

const isGuestOnlyRoute = (pathname) => {
  return pathname === "/login" || pathname === "/usuarios/novo";
};

function RouteGuard({ children }) {
  const router = useRouter();
  const { isAuthLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated && !isPublicRoute(router.pathname) && !isGuestOnlyRoute(router.pathname)) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isGuestOnlyRoute(router.pathname)) {
      router.replace(MAIN_ROUTE);
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading && !isPublicRoute(router.pathname)) {
    return null;
  }

  if (!isAuthenticated && !isPublicRoute(router.pathname) && !isGuestOnlyRoute(router.pathname)) {
    return null;
  }

  if (isAuthenticated && isGuestOnlyRoute(router.pathname)) {
    return null;
  }

  return children;
}

function AppLayout({ children }) {
  return <NavbarLayout>{children}</NavbarLayout>;
}

export default function App({ Component, pageProps }) {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RouteGuard>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          <ToastContainer
            autoClose={4000}
            closeOnClick
            draggable
            newestOnTop
            pauseOnFocusLoss={false}
            position="top-right"
          />
        </RouteGuard>
      </AuthProvider>
    </AppThemeProvider>
  );
}
