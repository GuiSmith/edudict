import predictDTO from "../dtos/prediction/predict.dto.js";
import predictService from "../services/predict.service.js";

const listar = async (req, res) => {
  const predictions = await predictService.listar({
    usuarioId: req.user?.id ?? null,
    guestSessionId: req.guest_session_id ?? null,
  });

  return res.status(200).json(predictions);
};

const predict = async (req, res) => {
  const predictionDTO = predictDTO(req.body);
  const prediction = await predictService.predict(predictionDTO, {
    usuarioId: req.user?.id ?? null,
    guestSessionId: req.guest_session_id ?? null,
  });

  return res.status(200).json(prediction);
};

export default {
  listar,
  predict,
};
