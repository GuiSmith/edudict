import { Router } from "express";

import chatsController from "../controllers/chats.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.get("/", asyncHandler(chatsController.listarChats));

export default router;
