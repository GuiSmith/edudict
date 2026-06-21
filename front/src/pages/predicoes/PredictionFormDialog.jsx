import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { toast } from "react-toastify";

import authAxios from "@/utils/authAxios";
import getApiErrorMessage from "@/utils/getApiErrorMessage";

const yesNoOptions = [
  { label: "Sim", value: "yes" },
  { label: "Não", value: "no" },
];

const educationOptions = [
  { label: "Nenhuma", value: 0 },
  { label: "Ensino fundamental I", value: 1 },
  { label: "Ensino fundamental II", value: 2 },
  { label: "Ensino médio", value: 3 },
  { label: "Ensino superior", value: 4 },
];

const qualityOptions = [
  { label: "1 — Muito ruim", value: 1 },
  { label: "2 — Ruim", value: 2 },
  { label: "3 — Indiferente", value: 3 },
  { label: "4 — Bom", value: 4 },
  { label: "5 — Muito bom", value: 5 },
];

const frequencyOptions = [
  { label: "1 — Muito baixa", value: 1 },
  { label: "2 — Baixa", value: 2 },
  { label: "3 — Moderada", value: 3 },
  { label: "4 — Alta", value: 4 },
  { label: "5 — Muito alta", value: 5 },
];

const quantityOptions = [
  { label: "1 — Muito pouco", value: 1 },
  { label: "2 — Pouco", value: 2 },
  { label: "3 — Moderado", value: 3 },
  { label: "4 — Bastante", value: 4 },
  { label: "5 — Muito", value: 5 },
];

const consumptionOptions = [
  { label: "1 — Muito baixo", value: 1 },
  { label: "2 — Baixo", value: 2 },
  { label: "3 — Moderado", value: 3 },
  { label: "4 — Alto", value: 4 },
  { label: "5 — Muito alto", value: 5 },
];

export const predictionSteps = [
  {
    label: "Estudante",
    description: "Dados básicos e contexto escolar.",
    fields: [
      {
        name: "subject",
        label: "Disciplina",
        options: [
          { label: "Matemática", value: "math" },
          { label: "Português", value: "portuguese" },
        ],
      },
      {
        name: "school",
        label: "Escola",
        options: [
          { label: "Gabriel Pereira", value: "GP" },
          { label: "Mousinho da Silveira", value: "MS" },
        ],
      },
      {
        name: "sex",
        label: "Sexo",
        options: [
          { label: "Feminino", value: "F" },
          { label: "Masculino", value: "M" },
        ],
      },
      { name: "age", label: "Idade", min: 15, max: 22, type: "number" },
      {
        name: "address",
        label: "Área de residência",
        options: [
          { label: "Urbana", value: "U" },
          { label: "Rural", value: "R" },
        ],
      },
      {
        name: "famsize",
        label: "Tamanho da família",
        options: [
          { label: "Até 3 pessoas", value: "LE3" },
          { label: "Mais de 3 pessoas", value: "GT3" },
        ],
      },
      {
        name: "Pstatus",
        label: "Situação dos pais",
        options: [
          { label: "Vivem juntos", value: "T" },
          { label: "Vivem separados", value: "A" },
        ],
      },
    ],
  },
  {
    label: "Família",
    description: "Escolaridade, trabalho e ambiente familiar.",
    fields: [
      { name: "Medu", label: "Escolaridade da mãe", options: educationOptions },
      { name: "Fedu", label: "Escolaridade do pai", options: educationOptions },
      {
        name: "Mjob",
        label: "Trabalho da mãe",
        options: [
          { label: "Professora", value: "teacher" },
          { label: "Saúde", value: "health" },
          { label: "Serviços", value: "services" },
          { label: "Em casa", value: "at_home" },
          { label: "Outro", value: "other" },
        ],
      },
      {
        name: "Fjob",
        label: "Trabalho do pai",
        options: [
          { label: "Professor", value: "teacher" },
          { label: "Saúde", value: "health" },
          { label: "Serviços", value: "services" },
          { label: "Em casa", value: "at_home" },
          { label: "Outro", value: "other" },
        ],
      },
      {
        name: "guardian",
        label: "Responsável",
        options: [
          { label: "Mãe", value: "mother" },
          { label: "Pai", value: "father" },
          { label: "Outro", value: "other" },
        ],
      },
      {
        name: "famrel",
        label: "Qualidade da relação familiar",
        options: qualityOptions,
      },
    ],
  },
  {
    label: "Estudos e suporte",
    description: "Rotina de estudos e apoios disponíveis.",
    fields: [
      {
        name: "reason",
        label: "Motivo da escolha da escola",
        options: [
          { label: "Perto de casa", value: "home" },
          { label: "Reputação", value: "reputation" },
          { label: "Curso", value: "course" },
          { label: "Outro", value: "other" },
        ],
      },
      {
        name: "traveltime",
        label: "Tempo de deslocamento",
        options: [
          { label: "Menos de 15 minutos", value: 1 },
          { label: "15 a 30 minutos", value: 2 },
          { label: "30 minutos a 1 hora", value: 3 },
          { label: "Mais de 1 hora", value: 4 },
        ],
      },
      {
        name: "studytime",
        label: "Tempo semanal de estudo",
        options: [
          { label: "Menos de 2 horas", value: 1 },
          { label: "2 a 5 horas", value: 2 },
          { label: "5 a 10 horas", value: 3 },
          { label: "Mais de 10 horas", value: 4 },
        ],
      },
      {
        name: "failures",
        label: "Reprovações anteriores",
        min: 0,
        max: 4,
        type: "number",
      },
      { name: "schoolsup", label: "Apoio educacional da escola", options: yesNoOptions },
      { name: "famsup", label: "Apoio educacional da família", options: yesNoOptions },
      { name: "paid", label: "Aulas particulares", options: yesNoOptions },
      { name: "nursery", label: "Frequentou educação infantil", options: yesNoOptions },
      { name: "higher", label: "Deseja cursar ensino superior", options: yesNoOptions },
      { name: "internet", label: "Possui internet em casa", options: yesNoOptions },
    ],
  },
  {
    label: "Rotina",
    description: "Hábitos, convivência, saúde e frequência.",
    fields: [
      { name: "activities", label: "Atividades extracurriculares", options: yesNoOptions },
      { name: "romantic", label: "Está em relacionamento amoroso", options: yesNoOptions },
      {
        name: "freetime",
        label: "Tempo livre após a escola",
        options: quantityOptions,
      },
      {
        name: "goout",
        label: "Frequência que sai com amigos",
        options: frequencyOptions,
      },
      {
        name: "Dalc",
        label: "Consumo de álcool em dias úteis",
        options: consumptionOptions,
      },
      {
        name: "Walc",
        label: "Consumo de álcool no fim de semana",
        options: consumptionOptions,
      },
      {
        name: "health",
        label: "Estado de saúde atual",
        options: qualityOptions,
      },
      {
        name: "absences",
        label: "Número de faltas",
        min: 0,
        max: 93,
        type: "number",
      },
    ],
  },
];

const initialFormData = {
  school: "GP",
  sex: "F",
  age: 17,
  address: "U",
  famsize: "GT3",
  Pstatus: "T",
  Medu: 2,
  Fedu: 2,
  Mjob: "other",
  Fjob: "other",
  reason: "course",
  guardian: "mother",
  traveltime: 1,
  studytime: 2,
  failures: 0,
  schoolsup: "no",
  famsup: "yes",
  paid: "no",
  activities: "yes",
  nursery: "yes",
  higher: "yes",
  internet: "yes",
  romantic: "no",
  famrel: 4,
  freetime: 3,
  goout: 3,
  Dalc: 1,
  Walc: 1,
  health: 4,
  absences: 0,
  subject: "math",
};

const isFieldValid = (field, value) => {
  if (field.type !== "number") {
    return value !== "";
  }

  return (
    Number.isInteger(value) &&
    value >= field.min &&
    value <= field.max
  );
};

export default function PredictionFormDialog({ onClose, onCreated, open }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStepIsValid = predictionSteps[activeStep].fields.every((field) =>
    isFieldValid(field, formData[field.name])
  );

  const resetAndClose = () => {
    if (isSubmitting) {
      return;
    }

    setActiveStep(0);
    setFormData(initialFormData);
    onClose();
  };

  const handleChange = (event) => {
    const { name, type, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await authAxios.post("/predict", formData);
      toast.success(
        response.data?.prediction === 1
          ? "Predição concluída: tendência de aprovação."
          : "Predição concluída: atenção ao risco de reprovação."
      );
      setActiveStep(0);
      setFormData(initialFormData);
      await onCreated();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      onClose={resetAndClose}
      open={open}
    >
      <DialogTitle>Nova predição</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ display: { sm: "flex", xs: "none" }, mb: 4 }}>
          {predictionSteps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography color="primary" fontWeight={700} variant="overline">
          Etapa {activeStep + 1} de {predictionSteps.length}
        </Typography>
        <Typography component="h2" sx={{ mt: 0.5 }} variant="h6">
          {predictionSteps[activeStep].label}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
          {predictionSteps[activeStep].description}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { sm: "repeat(2, minmax(0, 1fr))", xs: "1fr" },
          }}
        >
          {predictionSteps[activeStep].fields.map((field) => (
            <TextField
              fullWidth
              inputProps={
                field.type === "number"
                  ? { max: field.max, min: field.min }
                  : undefined
              }
              key={field.name}
              label={field.label}
              name={field.name}
              onChange={handleChange}
              required
              select={Boolean(field.options)}
              type={field.type}
              value={formData[field.name]}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ gap: 1, px: 3, py: 2 }}>
        <Button disabled={isSubmitting} onClick={resetAndClose}>
          Cancelar
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep > 0 ? (
          <Button
            disabled={isSubmitting}
            onClick={() => setActiveStep((current) => current - 1)}
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
        ) : null}
        {activeStep < predictionSteps.length - 1 ? (
          <Button
            disabled={!currentStepIsValid}
            endIcon={<ArrowForwardIcon />}
            onClick={() => setActiveStep((current) => current + 1)}
            variant="contained"
          >
            Continuar
          </Button>
        ) : (
          <Button
            disabled={isSubmitting || !currentStepIsValid}
            onClick={handleSubmit}
            startIcon={
              isSubmitting ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                <AutoGraphIcon />
              )
            }
            variant="contained"
          >
            {isSubmitting ? "Calculando..." : "Gerar predição"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
