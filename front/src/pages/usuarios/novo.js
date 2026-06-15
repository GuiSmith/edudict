import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

import authAxios from "@/utils/authAxios";
import formatCpf from "@/utils/formatCpf";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import getOnlyDigits from "@/utils/getOnlyDigits";

const INITIAL_FORM_DATA = {
  nome: "",
  cpf: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: name === "cpf" ? formatCpf(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (getOnlyDigits(formData.cpf).length !== 11) {
      toast.error("Informe um CPF válido.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    if (!formData.senha) {
      toast.error("Informe uma senha.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("A confirmação de senha deve ser igual à senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authAxios.post("/usuarios", {
        nome: formData.nome,
        cpf: getOnlyDigits(formData.cpf),
        email: formData.email,
        senha: formData.senha,
      });

      toast.success("Cadastro realizado com sucesso. Faça login para continuar.");
      router.replace("/login");
    } catch (error) {
      const nextErrorMessage = getApiErrorMessage(error);

      toast.error(nextErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Criar conta | edudict</title>
        <meta name="description" content="Crie sua conta no edudict" />
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
            width: "min(460px, 100%)",
          }}
        >
          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography component="h1" variant="h5">
                Criar conta
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Informe seus dados para acessar o sistema.
              </Typography>
            </Stack>
            <TextField
              autoComplete="name"
              disabled={isSubmitting}
              fullWidth
              label="Nome"
              name="nome"
              onChange={handleChange}
              required
              value={formData.nome}
            />

            <TextField
              autoComplete="off"
              disabled={isSubmitting}
              fullWidth
              inputProps={{ inputMode: "numeric" }}
              label="CPF"
              name="cpf"
              onChange={handleChange}
              placeholder="123.456.789-00"
              required
              value={formData.cpf}
            />

            <TextField
              autoComplete="email"
              disabled={isSubmitting}
              fullWidth
              label="E-mail"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />

            <TextField
              autoComplete="new-password"
              disabled={isSubmitting}
              fullWidth
              label="Senha"
              name="senha"
              onChange={handleChange}
              required
              type="password"
              value={formData.senha}
            />

            <TextField
              autoComplete="new-password"
              disabled={isSubmitting}
              fullWidth
              label="Confirmar senha"
              name="confirmarSenha"
              onChange={handleChange}
              required
              type="password"
              value={formData.confirmarSenha}
            />

            <Button
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <Typography align="center" color="text.secondary" variant="body2">
              Já possui uma conta?{" "}
              <Typography
                color="primary"
                component={Link}
                href="/login"
                sx={{ textDecoration: "none" }}
                variant="body2"
              >
                Entrar
              </Typography>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
