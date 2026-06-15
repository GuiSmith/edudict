import Alert from "@mui/material/Alert";
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

const INITIAL_FORM_DATA = {
  nome: "",
  cpf: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

const getOnlyDigits = (value) => value.replace(/\D/g, "");

const formatCpf = (value) => {
  const digits = getOnlyDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const getApiErrorMessage = (error) => {
  const fields = error.response?.data?.details?.fields || [];

  if (error.response?.status === 409) {
    if (fields.includes("cpf") && fields.includes("email")) {
      return "CPF e e-mail já cadastrados.";
    }

    if (fields.includes("cpf")) {
      return "CPF já cadastrado.";
    }

    if (fields.includes("email")) {
      return "E-mail já cadastrado.";
    }
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return "Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.";
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorMessage, setErrorMessage] = useState("");
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
    setErrorMessage("");

    if (getOnlyDigits(formData.cpf).length !== 11) {
      setErrorMessage("Informe um CPF válido.");
      toast.error("Informe um CPF válido.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Informe um e-mail válido.");
      toast.error("Informe um e-mail válido.");
      return;
    }

    if (!formData.senha) {
      setErrorMessage("Informe uma senha.");
      toast.error("Informe uma senha.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErrorMessage("A confirmação de senha deve ser igual à senha.");
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

      setErrorMessage(nextErrorMessage);
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

            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

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
