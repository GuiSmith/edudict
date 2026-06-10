import { Router } from "express";

import usuariosController from "../controllers/usuarios.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.post("/", asyncHandler(usuariosController.criarUsuario));
router.put("/", asyncHandler(usuariosController.editarUsuario));

export default router;
