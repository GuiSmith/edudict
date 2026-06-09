import {
  Box,
  Chip,
  CssBaseline,
  Paper,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Head from "next/head";
import { useMemo, useState } from "react";

import CriarUsuarioTab from "@/components/wiki/CriarUsuarioTab";
import FuncionalidadesPrevistasTab from "@/components/wiki/FuncionalidadesPrevistasTab";
import LoginTab from "@/components/wiki/LoginTab";
import LogoutTab from "@/components/wiki/LogoutTab";
import LogsSuporteTab from "@/components/wiki/LogsSuporteTab";
import VisaoGeralTab from "@/components/wiki/VisaoGeralTab";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2f6f73",
      dark: "#174447",
    },
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#152033",
      secondary: "#536176",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h2: {
      fontSize: "1.55rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    h3: {
      fontSize: "1.08rem",
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: 0,
    },
    body2: {
      lineHeight: 1.65,
      letterSpacing: 0,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          alignItems: "flex-start",
          borderRadius: 6,
          fontWeight: 700,
          letterSpacing: 0,
          minHeight: 42,
          textTransform: "none",
        },
      },
    },
  },
});

const wikiTabs = [
  {
    id: "visao-geral",
    label: "Visão geral",
    Component: VisaoGeralTab,
  },
  {
    id: "login",
    label: "Login",
    Component: LoginTab,
  },
  {
    id: "logout",
    label: "Logout",
    Component: LogoutTab,
  },
  {
    id: "criar-usuario",
    label: "Criar usuário",
    Component: CriarUsuarioTab,
  },
  {
    id: "logs-suporte",
    label: "Logs e suporte",
    Component: LogsSuporteTab,
  },
  {
    id: "previsto",
    label: "Previsto",
    Component: FuncionalidadesPrevistasTab,
  },
];

export default function WikiPage() {
  const [activeTabId, setActiveTabId] = useState(wikiTabs[0].id);
  const ActiveTab = useMemo(
    () => wikiTabs.find((tab) => tab.id === activeTabId)?.Component,
    [activeTabId]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Stocky Wiki do Sistema</title>
        <meta name="description" content="Wiki funcional do sistema Stocky" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "#d8e0ea",
            boxShadow: "0 18px 50px rgba(21, 32, 51, 0.08)",
            mx: "auto",
            overflow: "hidden",
            width: "min(1180px, 100%)",
          }}
        >
          <Box
            component="header"
            sx={{
              borderBottom: "1px solid",
              borderColor: "#d8e0ea",
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Stack spacing={1.25} sx={{ maxWidth: 780 }}>
              <Chip
                color="primary"
                label="Documentação funcional"
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: 1,
                  fontWeight: 700,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                }}
                variant="outlined"
              />
              <Typography component="h1" variant="h1">
                Wiki do sistema
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Fluxos implementados para autenticação e usuários, descritos
                para operação, suporte e manutenção.
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "230px minmax(0, 1fr)" },
              minHeight: { md: 620 },
            }}
          >
            <Box
              component="nav"
              sx={{
                bgcolor: "#f8fafc",
                borderBottom: { xs: "1px solid #d8e0ea", md: 0 },
                borderRight: { xs: 0, md: "1px solid #d8e0ea" },
                p: 2,
              }}
            >
              <Tabs
                aria-label="Módulos documentados"
                onChange={(_, nextTabId) => setActiveTabId(nextTabId)}
                orientation="vertical"
                value={activeTabId}
                variant="scrollable"
                sx={{
                  ".MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                {wikiTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.label}
                    value={tab.id}
                    sx={{
                      border: "1px solid transparent",
                      color: "text.secondary",
                      mb: 0.5,
                      px: 1.5,
                      py: 1.25,
                      "&.Mui-selected": {
                        bgcolor: "#e8f3f2",
                        borderColor: "primary.main",
                        color: "primary.dark",
                      },
                      "&:hover": {
                        bgcolor: "#ffffff",
                        borderColor: "#c8d6e6",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Box
              component="article"
              sx={{ px: { xs: 2.5, md: 4.25 }, py: { xs: 3, md: 3.75 } }}
            >
              {ActiveTab ? <ActiveTab /> : null}
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
