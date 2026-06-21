import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "@/contexts/AuthContext";
import authAxios from "@/utils/authAxios";
import formatCpf from "@/utils/formatCpf";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import getOnlyDigits from "@/utils/getOnlyDigits";

const INITIAL_FORM_DATA = {
  nome: "",
  cpf: "",
  email: "",
  senha: "",
};

export default function PerfilPage() {
  const { login, usuario } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = () => {
    setFormData({
      nome: usuario?.nome || "",
      cpf: formatCpf(usuario?.cpf || ""),
      email: usuario?.email || "",
      senha: "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isSubmitting) {
      return;
    }

    setDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: name === "cpf" ? formatCpf(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!usuario?.id) {
      toast.error("Não foi possível identificar o usuário autenticado.");
      return;
    }

    if (getOnlyDigits(formData.cpf).length !== 11) {
      toast.error("Informe um CPF válido.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authAxios.put("/usuarios", {
        id: usuario.id,
        nome: formData.nome,
        cpf: getOnlyDigits(formData.cpf),
        email: formData.email,
        ...(formData.senha ? { senha: formData.senha } : {}),
      });

      await login();
      toast.success("Perfil atualizado com sucesso.");
      setDialogOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Perfil | edudict</title>
      </Head>

      <Box sx={{ p: { md: 4, xs: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            maxWidth: 640,
            p: 3,
          }}
        >
          <Stack spacing={2}>
            <Typography component="h1" variant="h5">
              Perfil
            </Typography>
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography color="text.secondary">
                {usuario?.nome || "Usuário autenticado"}
              </Typography>
              {usuario?.email ? (
                <Typography
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {usuario.email}
                </Typography>
              ) : null}
            </Stack>
            <Button
              color="primary"
              onClick={handleOpenDialog}
              sx={{ alignSelf: "flex-start" }}
              variant="outlined"
            >
              Editar perfil
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleCloseDialog}
        open={dialogOpen}
      >
        <DialogTitle>Editar perfil</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
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
                helperText="Deixe em branco para manter a senha atual."
                label="Nova senha"
                name="senha"
                onChange={handleChange}
                type="password"
                value={formData.senha}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button disabled={isSubmitting} onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="contained"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
