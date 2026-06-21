import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CodeIcon from "@mui/icons-material/Code";
import DatasetIcon from "@mui/icons-material/Dataset";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";

const flowSteps = [
  {
    icon: SchoolOutlinedIcon,
    number: "01",
    title: "Você informa o contexto",
    description:
      "O formulário reúne 31 características acadêmicas, familiares e de rotina. Notas G1, G2 e G3 não são utilizadas.",
  },
  {
    icon: SecurityOutlinedIcon,
    number: "02",
    title: "O backend valida",
    description:
      "A API principal normaliza os dados, bloqueia campos indevidos e encaminha somente uma entrada válida ao serviço de Machine Learning.",
  },
  {
    icon: PsychologyOutlinedIcon,
    number: "03",
    title: "O modelo calcula",
    description:
      "A API Python transforma categorias, padroniza valores e executa o classificador para estimar aprovação ou reprovação.",
  },
  {
    icon: InsightsIcon,
    number: "04",
    title: "SHAP explica",
    description:
      "A explicabilidade local identifica os fatores que mais atuaram a favor ou contra o resultado específico daquela análise.",
  },
  {
    icon: ForumOutlinedIcon,
    number: "05",
    title: "O agente traduz",
    description:
      "Quando você solicita uma análise, o agente usa resultado, probabilidades e fatores SHAP para explicar sem inventar justificativas.",
  },
];

const modelFacts = [
  {
    title: "Base de dados",
    value: "≈ 1.044 registros",
    text: "Dados de Matemática e Português do Student Performance Dataset.",
  },
  {
    title: "Entradas",
    value: "31 variáveis",
    text: "Características disponíveis antes da nota final, sem G1, G2 ou G3.",
  },
  {
    title: "Objetivo",
    value: "2 classes",
    text: "Tendência de aprovação ou risco de reprovação.",
  },
];

const safeguards = [
  "A predição é apoio à decisão, não uma garantia sobre o futuro do estudante.",
  "Os fatores SHAP mostram contribuição estatística local, não causa e efeito.",
  "Se a explicabilidade falhar, a predição e as probabilidades continuam disponíveis.",
  "O agente recebe contexto controlado e não pode criar uma nova predição por conta própria.",
];

function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: align === "center" ? "auto" : 0,
        textAlign: align,
      }}
    >
      <Typography
        color="primary"
        fontWeight={800}
        sx={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
        variant="overline"
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h2"
        sx={{
          fontSize: { md: "2.6rem", sm: "2.15rem", xs: "1.8rem" },
          mt: 0.5,
        }}
        variant="h1"
      >
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body1">
        {description}
      </Typography>
    </Box>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>EduDict | Predição acadêmica explicável</title>
        <meta
          content="Entenda como o EduDict transforma dados acadêmicos em uma predição explicável e contextualizada."
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Box sx={{ overflow: "hidden" }}>
        <Box
          component="section"
          sx={{
            background: (theme) =>
              theme.palette.mode === "light"
                ? "radial-gradient(circle at 82% 22%, rgba(47,111,115,0.18), transparent 31%), linear-gradient(145deg, #f8fbfc 0%, #eef5f7 48%, #f4f7fb 100%)"
                : "radial-gradient(circle at 82% 22%, rgba(127,199,201,0.16), transparent 31%), linear-gradient(145deg, #111827 0%, #16232d 55%, #111827 100%)",
            borderBottom: "1px solid",
            borderColor: "divider",
            minHeight: { md: "82vh", xs: "auto" },
            px: { lg: 8, md: 5, xs: 2.5 },
            py: { md: 10, xs: 9 },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "grid",
              gap: { lg: 8, md: 5, xs: 6 },
              gridTemplateColumns: { md: "minmax(0, 1.1fr) minmax(360px, 0.9fr)", xs: "1fr" },
              maxWidth: 1280,
              mx: "auto",
            }}
          >
            <Box>
              <Chip
                color="primary"
                icon={<AutoAwesomeIcon />}
                label="Machine Learning + SHAP + Agente inteligente"
                variant="outlined"
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { lg: "4.4rem", md: "3.5rem", sm: "3.2rem", xs: "2.45rem" },
                  letterSpacing: "-0.045em",
                  lineHeight: 1.02,
                  mt: 3,
                  maxWidth: 780,
                }}
                variant="h1"
              >
                Da informação acadêmica a uma{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  predição explicável.
                </Box>
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { sm: "1.15rem", xs: "1rem" }, maxWidth: 680, mt: 3 }}
              >
                O EduDict combina um modelo preditivo, explicabilidade local e
                inteligência generativa para indicar tendências acadêmicas e
                explicar quais fatores contribuíram para cada resultado.
              </Typography>
              <Stack
                direction={{ sm: "row", xs: "column" }}
                spacing={1.5}
                sx={{ mt: 4 }}
              >
                <Button
                  LinkComponent={Link}
                  endIcon={<ArrowForwardIcon />}
                  href="/predicoes"
                  size="large"
                  variant="contained"
                >
                  Fazer uma predição
                </Button>
                <Button
                  LinkComponent={Link}
                  href="/docs/wiki"
                  size="large"
                  variant="outlined"
                >
                  Explorar a documentação
                </Button>
              </Stack>
              <Stack
                direction={{ sm: "row", xs: "column" }}
                spacing={{ sm: 3, xs: 1 }}
                sx={{ color: "text.secondary", mt: 4 }}
              >
                {["Uso com ou sem conta", "Histórico persistido", "Explicação local"].map(
                  (item) => (
                    <Stack alignItems="center" direction="row" key={item} spacing={0.75}>
                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      <Typography variant="body2">{item}</Typography>
                    </Stack>
                  )
                )}
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                backdropFilter: "blur(16px)",
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,0.82)"
                    : "rgba(31,41,55,0.82)",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 30px 80px rgba(16, 35, 48, 0.16)",
                p: { sm: 3, xs: 2.25 },
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Exemplo de resultado
                  </Typography>
                  <Typography component="p" fontWeight={800} variant="h5">
                    Risco de reprovação
                  </Typography>
                </Box>
                <Chip color="warning" label="Análise local" size="small" />
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2">Probabilidade estimada</Typography>
                  <Typography color="warning.main" fontWeight={800}>
                    74%
                  </Typography>
                </Stack>
                <LinearProgress
                  color="warning"
                  sx={{ borderRadius: 10, height: 9, mt: 1 }}
                  value={74}
                  variant="determinate"
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              <Typography fontWeight={700} variant="body2">
                Fatores que mais contribuíram
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                {[
                  ["Reprovações anteriores", "A favor do resultado", "warning.main"],
                  ["Quantidade de faltas", "A favor do resultado", "warning.main"],
                  ["Tempo semanal de estudo", "Contra o resultado", "success.main"],
                ].map(([feature, direction, color]) => (
                  <Box
                    key={feature}
                    sx={{
                      bgcolor: "action.hover",
                      borderRadius: 1.5,
                      display: "flex",
                      gap: 2,
                      justifyContent: "space-between",
                      p: 1.5,
                    }}
                  >
                    <Typography fontWeight={700} variant="body2">
                      {feature}
                    </Typography>
                    <Typography color={color} textAlign="right" variant="caption">
                      {direction}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Typography color="text.secondary" sx={{ display: "block", mt: 2 }} variant="caption">
                Exemplo ilustrativo. Cada resultado depende dos dados informados.
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{ px: { lg: 8, md: 5, xs: 2.5 }, py: { md: 10, xs: 7 } }}
        >
          <Box sx={{ maxWidth: 1280, mx: "auto" }}>
            <SectionHeading
              align="center"
              description="O sistema separa responsabilidades para que cada etapa seja validada, persistida e explicada com clareza."
              eyebrow="Do começo ao fim"
              title="Uma jornada completa em cinco etapas"
            />
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  lg: "repeat(5, minmax(0, 1fr))",
                  sm: "repeat(2, minmax(0, 1fr))",
                  xs: "1fr",
                },
                mt: 5,
              }}
            >
              {flowSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <Paper
                    elevation={0}
                    key={step.number}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 270,
                      p: 2.5,
                    }}
                  >
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Box
                        sx={{
                          bgcolor: "action.selected",
                          borderRadius: 2,
                          color: "primary.main",
                          display: "grid",
                          height: 46,
                          placeItems: "center",
                          width: 46,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Typography color="text.disabled" fontWeight={800} variant="h5">
                        {step.number}
                      </Typography>
                    </Stack>
                    <Typography component="h3" sx={{ mt: 3 }} variant="h3">
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.25 }} variant="body2">
                      {step.description}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            bgcolor: "background.paper",
            borderBlock: "1px solid",
            borderColor: "divider",
            px: { lg: 8, md: 5, xs: 2.5 },
            py: { md: 10, xs: 7 },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "grid",
              gap: { md: 8, xs: 5 },
              gridTemplateColumns: { md: "0.9fr 1.1fr", xs: "1fr" },
              maxWidth: 1180,
              mx: "auto",
            }}
          >
            <Box>
              <SectionHeading
                description="O modelo foi treinado para reconhecer padrões estatísticos associados à aprovação e à reprovação, sem utilizar as notas que definem diretamente o resultado final."
                eyebrow="O modelo preditivo"
                title="Aprender padrões sem olhar a resposta"
              />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Variáveis categóricas são transformadas por One-Hot Encoding,
                valores numéricos são padronizados e o classificador produz uma
                classe acompanhada das probabilidades estimadas.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { sm: "repeat(3, 1fr)", xs: "1fr" },
                  mt: 4,
                }}
              >
                {modelFacts.map((fact) => (
                  <Box
                    key={fact.title}
                    sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2 }}
                  >
                    <Typography color="text.secondary" variant="caption">
                      {fact.title}
                    </Typography>
                    <Typography color="primary" fontWeight={800} variant="h6">
                      {fact.value}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="caption">
                      {fact.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Paper
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", p: { sm: 4, xs: 2.5 } }}
            >
              <Stack spacing={2.5}>
                {[
                  [DatasetIcon, "Dados preparados", "31 campos válidos e organizados"],
                  [CodeIcon, "Pré-processamento", "Padronização e codificação categórica"],
                  [PsychologyOutlinedIcon, "Classificação", "Predição e probabilidades por classe"],
                  [AutoGraphIcon, "Explicabilidade", "Principais contribuições locais com SHAP"],
                ].map(([Icon, title, description], index) => (
                  <Box key={title}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          bgcolor: index === 3 ? "primary.main" : "action.selected",
                          borderRadius: "50%",
                          color: index === 3 ? "primary.contrastText" : "primary.main",
                          display: "grid",
                          flexShrink: 0,
                          height: 48,
                          placeItems: "center",
                          width: 48,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Box>
                        <Typography fontWeight={800}>{title}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {description}
                        </Typography>
                      </Box>
                    </Stack>
                    {index < 3 ? (
                      <Box sx={{ bgcolor: "divider", height: 22, ml: 3, my: 0.5, width: 2 }} />
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{ px: { lg: 8, md: 5, xs: 2.5 }, py: { md: 10, xs: 7 } }}
        >
          <Box
            sx={{
              display: "grid",
              gap: { md: 7, xs: 5 },
              gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
              maxWidth: 1180,
              mx: "auto",
            }}
          >
            <Box>
              <SectionHeading
                description="Uma probabilidade informa quanto o modelo favoreceu uma classe. SHAP ajuda a entender como cada característica contribuiu para chegar naquele resultado."
                eyebrow="Resultado explicável"
                title="Não basta prever. É preciso contextualizar."
              />
              <Stack spacing={2} sx={{ mt: 4 }}>
                {[
                  ["Resultado bruto", "Classe prevista e probabilidades são mostradas antes de qualquer interpretação."],
                  ["Explicação local", "São selecionados até cinco fatores com maior impacto absoluto para aquela entrada."],
                  ["Linguagem natural", "O agente transforma os fatores em uma explicação clara, sem apresentar correlação como causalidade."],
                ].map(([title, description], index) => (
                  <Stack direction="row" key={title} spacing={2}>
                    <Typography color="primary" fontWeight={900}>
                      0{index + 1}
                    </Typography>
                    <Box>
                      <Typography fontWeight={800}>{title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#173b3e" : "#0b2528",
                color: "common.white",
                overflow: "hidden",
                p: { sm: 4, xs: 2.5 },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <ForumOutlinedIcon sx={{ color: "primary.light" }} />
                <Typography fontWeight={800}>Como o agente pode responder</Typography>
              </Stack>
              <Typography
                sx={{ fontSize: { sm: "1.3rem", xs: "1.08rem" }, lineHeight: 1.65, mt: 4 }}
              >
                “O modelo indicou maior risco de reprovação. Entre os fatores
                que mais contribuíram para esse resultado estão o histórico de
                reprovações e a quantidade de faltas. Esses fatores atuaram a
                favor da estimativa segundo os padrões aprendidos pelo modelo.”
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.18)", my: 4 }} />
              <Stack spacing={1.25}>
                {["Sem inventar fatores", "Sem afirmar causalidade", "Sem esconder as limitações"].map(
                  (item) => (
                    <Stack direction="row" key={item} spacing={1}>
                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      <Typography color="rgba(255,255,255,0.75)" variant="body2">
                        {item}
                      </Typography>
                    </Stack>
                  )
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            bgcolor: "background.paper",
            borderBlock: "1px solid",
            borderColor: "divider",
            px: { lg: 8, md: 5, xs: 2.5 },
            py: { md: 10, xs: 7 },
          }}
        >
          <Box sx={{ maxWidth: 1180, mx: "auto" }}>
            <SectionHeading
              align="center"
              description="O serviço preditivo permanece isolado da aplicação principal, enquanto o backend controla validação, persistência, propriedade dos dados e contexto do agente."
              eyebrow="Arquitetura"
              title="Serviços separados, uma experiência contínua"
            />
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { md: "repeat(4, 1fr)", sm: "repeat(2, 1fr)", xs: "1fr" },
                mt: 5,
              }}
            >
              {[
                [HubOutlinedIcon, "Frontend Next.js", "Formulário, histórico, detalhes e chat."],
                [SecurityOutlinedIcon, "Backend Express", "Validação, regras, segurança e integrações."],
                [PsychologyOutlinedIcon, "API Python", "Modelo, probabilidades e SHAP."],
                [StorageOutlinedIcon, "PostgreSQL", "Predições, chats, mensagens e auditoria."],
              ].map(([Icon, title, description]) => (
                <Paper
                  elevation={0}
                  key={title}
                  sx={{ border: "1px solid", borderColor: "divider", p: 3, textAlign: "center" }}
                >
                  <Icon color="primary" sx={{ fontSize: 38 }} />
                  <Typography component="h3" sx={{ mt: 2 }} variant="h3">
                    {title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                    {description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{ px: { lg: 8, md: 5, xs: 2.5 }, py: { md: 10, xs: 7 } }}
        >
          <Box
            sx={{
              display: "grid",
              gap: { md: 7, xs: 4 },
              gridTemplateColumns: { md: "0.85fr 1.15fr", xs: "1fr" },
              maxWidth: 1100,
              mx: "auto",
            }}
          >
            <SectionHeading
              description="O EduDict foi construído para comunicar incerteza e apoiar a compreensão do resultado, sem transformar uma estimativa em sentença."
              eyebrow="Uso responsável"
              title="Predição é apoio, não decisão."
            />
            <Stack spacing={1.5}>
              {safeguards.map((item) => (
                <Paper
                  elevation={0}
                  key={item}
                  sx={{
                    alignItems: "flex-start",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    gap: 1.5,
                    p: 2,
                  }}
                >
                  <CheckCircleOutlineIcon color="primary" />
                  <Typography color="text.secondary" variant="body2">
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{ px: { lg: 8, md: 5, xs: 2.5 }, pb: { md: 10, xs: 7 } }}
        >
          <Paper
            elevation={0}
            sx={{
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #245b5f 0%, #173b3e 100%)"
                  : "linear-gradient(135deg, #275e62 0%, #102b2e 100%)",
              color: "common.white",
              maxWidth: 1180,
              mx: "auto",
              overflow: "hidden",
              p: { md: 7, sm: 5, xs: 3 },
              position: "relative",
              textAlign: "center",
            }}
          >
            <AutoGraphIcon
              sx={{
                color: "rgba(255,255,255,0.08)",
                fontSize: 260,
                position: "absolute",
                right: -30,
                top: -60,
                transform: "rotate(-8deg)",
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Typography component="h2" sx={{ fontSize: { md: "2.7rem", xs: "2rem" } }} variant="h1">
                Pronto para acompanhar o fluxo completo?
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.74)", maxWidth: 680, mt: 2, mx: "auto" }}
              >
                Informe os dados, receba a estimativa e, se quiser, converse
                com o agente para compreender os principais fatores daquela
                predição.
              </Typography>
              <Stack
                direction={{ sm: "row", xs: "column" }}
                justifyContent="center"
                spacing={1.5}
                sx={{ mt: 4 }}
              >
                <Button
                  LinkComponent={Link}
                  endIcon={<ArrowForwardIcon />}
                  href="/predicoes"
                  size="large"
                  sx={{
                    bgcolor: "common.white",
                    color: "#173b3e",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  variant="contained"
                >
                  Começar agora
                </Button>
                <Button
                  LinkComponent={Link}
                  href="/docs/wiki"
                  size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.55)",
                    color: "common.white",
                    "&:hover": { borderColor: "common.white" },
                  }}
                  variant="outlined"
                >
                  Ler a wiki
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
