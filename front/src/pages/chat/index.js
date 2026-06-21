import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import authAxios from "@/utils/authAxios";
import getApiErrorMessage from "@/utils/getApiErrorMessage";

const MAX_MESSAGE_LENGTH = 500;
const CHATS_CHANGE_EVENT = "edudict-chats-change";

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!chatId) {
      const clearMessages = window.setTimeout(() => setMessages([]), 0);

      return () => {
        window.clearTimeout(clearMessages);
      };
    }

    let active = true;
    const showLoading = window.setTimeout(() => {
      setIsLoadingMessages(true);
    }, 0);

    authAxios
      .get("/mensagens", { params: { id_chat: chatId } })
      .then((response) => {
        if (active) {
          setMessages(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(getApiErrorMessage(error));
          router.replace("/chat");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingMessages(false);
        }
      });

    return () => {
      active = false;
      window.clearTimeout(showLoading);
    };
  }, [chatId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const content = message.trim();

    if (!content || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const response = await authAxios.post("/mensagens", {
        ...(chatId ? { id_chat: Number(chatId) } : {}),
        content,
      });
      const createdChatId = response.data?.chat?.id;

      setMessage("");
      setMessages((currentMessages) => [
        ...currentMessages,
        response.data.mensagemUsuario,
        response.data.mensagemAssistente,
      ]);

      if (!chatId && createdChatId) {
        await router.replace(
          { pathname: "/chat", query: { id: createdChatId } },
          undefined,
          { shallow: true }
        );
        window.dispatchEvent(new Event(CHATS_CHANGE_EVENT));
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Head>
        <title>Novo Chat | edudict</title>
        <meta
          name="description"
          content="Converse com o agente preditivo do edudict"
        />
      </Head>

      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            overflowY: "auto",
            px: { md: 4, xs: 2 },
            py: { md: 7, xs: 10 },
          }}
        >
          {isLoadingMessages ? (
            <CircularProgress aria-label="Carregando mensagens" />
          ) : messages.length === 0 ? (
            <Stack
              spacing={3}
              sx={{
                alignItems: "center",
                maxWidth: 820,
                textAlign: "center",
                width: "100%",
              }}
            >
              <Box
                aria-hidden
                sx={{
                  bgcolor: "action.selected",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: "50%",
                  boxShadow: (theme) =>
                    `0 0 42px ${theme.palette.primary.main}2a`,
                  color: "primary.main",
                  display: "grid",
                  height: 76,
                  placeItems: "center",
                  width: 76,
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: { md: 50, sm: 42, xs: 31 },
                  lineHeight: 1.12,
                  maxWidth: 820,
                  textAlign: "center",
                }}
                variant="h1"
              >
                Faça uma pergunta para continuar
              </Typography>
            </Stack>
          ) : (
            <Stack
              spacing={2}
              sx={{ alignSelf: "stretch", maxWidth: 900, mx: "auto", width: "100%" }}
            >
              {messages.map((chatMessage) => (
                <Paper
                  elevation={0}
                  key={chatMessage.id}
                  sx={{
                    alignSelf:
                      chatMessage.role === "user" ? "flex-end" : "flex-start",
                    bgcolor:
                      chatMessage.role === "user"
                        ? "primary.main"
                        : "background.paper",
                    border:
                      chatMessage.role === "user" ? 0 : "1px solid",
                    borderColor: "divider",
                    color:
                      chatMessage.role === "user"
                        ? "primary.contrastText"
                        : "text.primary",
                    maxWidth: { sm: "78%", xs: "92%" },
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography sx={{ whiteSpace: "pre-wrap" }} variant="body1">
                    {chatMessage.content}
                  </Typography>
                </Paper>
              ))}
              {isSending ? (
                <Paper
                  elevation={0}
                  sx={{
                    alignSelf: "flex-start",
                    border: "1px solid",
                    borderColor: "divider",
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                  >
                    <CircularProgress size={18} />
                    <Typography color="text.secondary" variant="body2">
                      O agente está analisando...
                    </Typography>
                  </Stack>
                </Paper>
              ) : null}
              <Box ref={messagesEndRef} />
            </Stack>
          )}
        </Box>

        <Box
          sx={{
            alignItems: "center",
            bgcolor: "background.default",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            px: 2,
            pb: 2,
            position: "sticky",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              alignItems: "center",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 18px 60px rgba(21, 32, 51, 0.14)"
                  : "0 18px 60px rgba(0, 0, 0, 0.35)",
              display: "flex",
              gap: 1.5,
              minHeight: 64,
              px: { sm: 2.5, xs: 2 },
              py: 1,
              width: "min(900px, 100%)",
            }}
          >
            <InputBase
              disabled={isSending}
              fullWidth
              inputProps={{
                "aria-label": "Pergunte ao agente preditivo",
                maxLength: MAX_MESSAGE_LENGTH,
              }}
              multiline
              maxRows={4}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte ao agente preditivo..."
              value={message}
            />

            <IconButton
              aria-label="Enviar pergunta"
              disabled={!message.trim() || isSending}
              onClick={handleSend}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                flex: "0 0 auto",
                height: 46,
                width: 46,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {isSending ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                <ArrowUpwardRoundedIcon />
              )}
            </IconButton>
          </Paper>

          <Typography
            color="text.secondary"
            sx={{ px: 2, textAlign: "center" }}
            variant="caption"
          >
            O agente pode cometer erros. Considere verificar informações
            importantes.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
