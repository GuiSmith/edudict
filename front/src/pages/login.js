import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import authAxios from "@/utils/authAxios";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthLoading, login } = useAuth();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await authAxios.post("/auth/login", formData);
      const user = await login();

      if (user) {
        router.replace("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Nao foi possivel entrar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | edudict</title>
        <meta name="description" content="Acesso ao sistema edudict" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        component="main"
        sx={{
          alignItems: "center",
          bgcolor: "background.default",
          display: "flex",
          minHeight: "100vh",
          px: 2,
          py: 4,
        }}
      >
        <Paper
          component="form"
          elevation={0}
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? "0 18px 50px rgba(21, 32, 51, 0.08)"
                : "0 18px 50px rgba(0, 0, 0, 0.28)",
            mx: "auto",
            p: { xs: 3, sm: 4 },
            width: "min(420px, 100%)",
          }}
        >
          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography component="h1" variant="h5">
                Entrar no edudict
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Use seu e-mail ou CPF para acessar o sistema.
              </Typography>
            </Stack>

            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

            <TextField
              autoComplete="username"
              disabled={isSubmitting || isAuthLoading}
              fullWidth
              label="E-mail ou CPF"
              name="login"
              onChange={handleChange}
              required
              value={formData.login}
            />

            <TextField
              autoComplete="current-password"
              disabled={isSubmitting || isAuthLoading}
              fullWidth
              label="Senha"
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formData.password}
            />

            <Button
              disabled={isSubmitting || isAuthLoading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
