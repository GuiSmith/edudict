import { Router } from "express";

import predictController from "../controllers/predict.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.get("/", asyncHandler(predictController.listar));
router.post("/", asyncHandler(predictController.predict));

export default router;
