import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";

import { useAuth } from "@/contexts/AuthContext";

export default function PerfilPage() {
  const { usuario } = useAuth();

  return (
    <>
      <Head>
        <title>Perfil | edudict</title>
      </Head>

      <Box sx={{ p: { md: 4, xs: 8 } }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            maxWidth: 640,
            p: 3,
          }}
        >
          <Stack spacing={1}>
            <Typography component="h1" variant="h5">
              Perfil
            </Typography>
            <Typography color="text.secondary">
              {usuario?.nome || "Usuário autenticado"}
            </Typography>
            {usuario?.email ? (
              <Typography color="text.secondary">{usuario.email}</Typography>
            ) : null}
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
