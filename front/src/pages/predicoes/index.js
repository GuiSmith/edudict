import AddIcon from "@mui/icons-material/Add";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import PredictionFormDialog from "@/pages/predicoes/PredictionFormDialog";
import PredictionDetailsDialog from "@/pages/predicoes/PredictionDetailsDialog";
import authAxios from "@/utils/authAxios";
import formatDateTime from "@/utils/formatDateTime";
import getApiErrorMessage from "@/utils/getApiErrorMessage";

const subjectLabels = {
  math: "Matemática",
  portuguese: "Português",
};

const formatProbability = (value) => {
  if (typeof value !== "number") {
    return null;
  }

  return `${Math.round(value * 100)}%`;
};

const getApprovalProbability = (prediction) => {
  const probabilities = prediction.resultado_predicao?.probabilities;

  if (!probabilities) {
    return null;
  }

  return formatProbability(probabilities.Aprovado ?? probabilities.approved);
};

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const loadPredictions = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await authAxios.get("/predict");
      setPredictions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadPredictions, 0);

    return () => {
      window.clearTimeout(initialLoad);
    };
  }, [loadPredictions]);

  const handleCreated = async () => {
    setDialogOpen(false);
    await loadPredictions();
  };

  return (
    <>
      <Head>
        <title>Predições | edudict</title>
        <meta
          content="Histórico e formulário de predições acadêmicas"
          name="description"
        />
      </Head>

      <Box component="main" sx={{ p: { md: 4, xs: 2 } }}>
        <Stack
          direction={{ sm: "row", xs: "column" }}
          spacing={2}
          sx={{
            alignItems: { sm: "center", xs: "stretch" },
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography component="h1" variant="h4">
              Predições
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Consulte análises anteriores ou informe novos dados acadêmicos.
            </Typography>
          </Box>
          <Button
            onClick={() => setDialogOpen(true)}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Nova predição
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "grid", minHeight: 240, placeItems: "center" }}>
            <CircularProgress aria-label="Carregando predições" />
          </Box>
        ) : predictions.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              p: { sm: 6, xs: 4 },
              textAlign: "center",
            }}
          >
            <AutoGraphIcon color="primary" sx={{ fontSize: 48, mb: 1.5 }} />
            <Typography component="h2" variant="h6">
              Nenhuma predição realizada
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5, mt: 0.5 }}>
              Preencha o formulário em etapas para gerar sua primeira análise.
            </Typography>
            <Button
              onClick={() => setDialogOpen(true)}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Nova predição
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                lg: "repeat(3, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                xs: "1fr",
              },
            }}
          >
            {predictions.map((prediction) => {
              const probability = getApprovalProbability(prediction);

              return (
                <Paper
                  elevation={0}
                  key={prediction.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 2.5,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      #{prediction.id}
                    </Typography>
                    <Chip
                      color={prediction.aprovado ? "success" : "warning"}
                      label={
                        prediction.aprovado
                          ? "Tendência de aprovação"
                          : "Risco de reprovação"
                      }
                      size="small"
                    />
                  </Stack>

                  <Box>
                    <Typography component="h2" variant="h6">
                      {subjectLabels[prediction.subject] || prediction.subject}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Estudante de {prediction.age} anos · {prediction.absences} faltas
                    </Typography>
                  </Box>

                  {probability ? (
                    <Box>
                      <Typography color="text.secondary" variant="caption">
                        Probabilidade de aprovação
                      </Typography>
                      <Typography color="primary" fontWeight={700} variant="h5">
                        {probability}
                      </Typography>
                    </Box>
                  ) : null}

                  <Typography color="text.secondary" sx={{ mt: "auto" }} variant="caption">
                    {formatDateTime(prediction.data_hora_criacao)}
                  </Typography>

                  <Button
                    onClick={() => setSelectedPrediction(prediction)}
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                  >
                    Visualizar predição
                  </Button>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      <PredictionFormDialog
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
        open={dialogOpen}
      />
      <PredictionDetailsDialog
        onClose={() => setSelectedPrediction(null)}
        open={Boolean(selectedPrediction)}
        prediction={selectedPrediction}
      />
    </>
  );
}
