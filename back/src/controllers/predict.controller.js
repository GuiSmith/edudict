import predictDTO from "../dtos/prediction/predict.dto.js";
import predictService from "../services/predict.service.js";

const predict = async (req, res) => {
  const predictionDTO = predictDTO(req.body);
  const prediction = await predictService.predict(predictionDTO);

  return res.status(200).json(prediction);
};

export default {
  predict,
};
