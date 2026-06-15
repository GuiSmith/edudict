import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useMemo, useState } from "react";

import CriarUsuarioTab from "@/components/wiki/CriarUsuarioTab";
import EditarUsuarioTab from "@/components/wiki/EditarUsuarioTab";
import FuncionalidadesPrevistasTab from "@/components/wiki/FuncionalidadesPrevistasTab";
import LoginTab from "@/components/wiki/LoginTab";
import LogoutTab from "@/components/wiki/LogoutTab";
import LogsSuporteTab from "@/components/wiki/LogsSuporteTab";
import VisaoGeralTab from "@/components/wiki/VisaoGeralTab";

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
    id: "editar-usuario",
    label: "Editar usuário",
    Component: EditarUsuarioTab,
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
    <>
      <Head>
        <title>edudict Wiki do Sistema</title>
        <meta name="description" content="Wiki funcional do sistema edudict" />
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
            borderColor: "divider",
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? "0 18px 50px rgba(21, 32, 51, 0.08)"
                : "0 18px 50px rgba(0, 0, 0, 0.28)",
            mx: "auto",
            overflow: "hidden",
            width: "min(1180px, 100%)",
          }}
        >
          <Box
            component="header"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
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
                bgcolor: "action.hover",
                borderBottom: { xs: "1px solid", md: 0 },
                borderBottomColor: "divider",
                borderRight: { xs: 0, md: "1px solid" },
                borderRightColor: "divider",
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
                        bgcolor: "action.selected",
                        borderColor: "primary.main",
                        color: "primary.main",
                      },
                      "&:hover": {
                        bgcolor: "background.paper",
                        borderColor: "divider",
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
    </>
  );
}
