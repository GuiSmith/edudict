import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();
  const hasRequestedLogout = useRef(false);

  useEffect(() => {
    if (hasRequestedLogout.current) {
      return;
    }

    hasRequestedLogout.current = true;
    logout();
  }, [logout]);

  return (
    <>
      <Head>
        <title>Saindo | edudict</title>
      </Head>

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            mx: "auto",
            p: 4,
            textAlign: "center",
            width: "min(360px, 100%)",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={32} />
            <Typography component="h1" variant="h6">
              Encerrando sessão
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Você será redirecionado para o login.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
