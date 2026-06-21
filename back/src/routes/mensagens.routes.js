import { Router } from "express";

import mensagensController from "../controllers/mensagens.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.post("/", asyncHandler(mensagensController.criarMensagem));

export default router;
