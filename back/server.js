import "dotenv/config";

import express from "express";

import NotFoundError from "./src/errors/not-found.error.js";
import authMiddleware from "./src/middlewares/auth.middleware.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import logMiddleware from "./src/middlewares/log.middleware.js";
import loadRoutes from "./src/routes/index.js";

const app = express();

const port = 3000;

app.use(express.json());
app.use(corsMiddleware);
app.use(logMiddleware);
app.use(authMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "edudict-backend",
  });
});
app.use(await loadRoutes());
app.use((req, res) => {
  throw new NotFoundError("Rota não encontrada", {
    path: req.originalUrl,
  });
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
