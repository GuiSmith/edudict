import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { predictionSteps } from "@/pages/predicoes/PredictionFormDialog";
import formatDateTime from "@/utils/formatDateTime";

const formatFieldValue = (field, value) => {
  const option = field.options?.find(
    (currentOption) => String(currentOption.value) === String(value)
  );

  if (option) {
    return option.label;
  }

  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }

  return String(value);
};

export default function PredictionDetailsDialog({
  onClose,
  open,
  prediction,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!prediction) {
    return null;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
    >
      <DialogTitle>Relatório da predição #{prediction.id}</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            alignItems: { sm: "center", xs: "flex-start" },
            display: "flex",
            flexDirection: { sm: "row", xs: "column" },
            gap: 1.5,
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              Predição realizada em
            </Typography>
            <Typography fontWeight={600}>
              {formatDateTime(prediction.data_hora_criacao)}
            </Typography>
          </Box>
          <Chip
            color={prediction.aprovado ? "success" : "warning"}
            label={
              prediction.aprovado
                ? "Tendência de aprovação"
                : "Risco de reprovação"
            }
          />
        </Box>

        {predictionSteps.map((step, index) => (
          <Box key={step.label} sx={{ mb: index === predictionSteps.length - 1 ? 0 : 3 }}>
            <Typography component="h2" sx={{ mb: 1.5 }} variant="h6">
              {step.label}
            </Typography>
            <Box
              component="dl"
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  xs: "1fr",
                },
                m: 0,
              }}
            >
              {step.fields.map((field) => (
                <Box key={field.name} sx={{ minWidth: 0 }}>
                  <Typography
                    color="text.secondary"
                    component="dt"
                    variant="caption"
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    component="dd"
                    sx={{ m: 0, overflowWrap: "anywhere" }}
                  >
                    {formatFieldValue(field, prediction[field.name])}
                  </Typography>
                </Box>
              ))}
            </Box>
            {index < predictionSteps.length - 1 ? <Divider sx={{ mt: 3 }} /> : null}
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
