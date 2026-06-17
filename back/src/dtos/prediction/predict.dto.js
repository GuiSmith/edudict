import BadRequestError from "../../errors/bad-request.error.js";

const forbiddenFields = ["G1", "G2", "G3"];

const categoricalChoices = {
  school: ["GP", "MS"],
  sex: ["F", "M"],
  address: ["U", "R"],
  famsize: ["LE3", "GT3"],
  Pstatus: ["T", "A"],
  Mjob: ["teacher", "health", "services", "at_home", "other"],
  Fjob: ["teacher", "health", "services", "at_home", "other"],
  reason: ["home", "reputation", "course", "other"],
  guardian: ["mother", "father", "other"],
  schoolsup: ["yes", "no"],
  famsup: ["yes", "no"],
  paid: ["yes", "no"],
  activities: ["yes", "no"],
  nursery: ["yes", "no"],
  higher: ["yes", "no"],
  internet: ["yes", "no"],
  romantic: ["yes", "no"],
  subject: ["math", "portuguese"],
};

const intRanges = {
  age: [15, 22],
  absences: [0, 93],
  Medu: [0, 4],
  Fedu: [0, 4],
  traveltime: [1, 4],
  studytime: [1, 4],
  failures: [0, 4],
  famrel: [1, 5],
  freetime: [1, 5],
  goout: [1, 5],
  Dalc: [1, 5],
  Walc: [1, 5],
  health: [1, 5],
};

const predictionFields = [
  "school",
  "sex",
  "age",
  "address",
  "famsize",
  "Pstatus",
  "Medu",
  "Fedu",
  "Mjob",
  "Fjob",
  "reason",
  "guardian",
  "traveltime",
  "studytime",
  "failures",
  "schoolsup",
  "famsup",
  "paid",
  "activities",
  "nursery",
  "higher",
  "internet",
  "romantic",
  "famrel",
  "freetime",
  "goout",
  "Dalc",
  "Walc",
  "health",
  "absences",
  "subject",
];

const hasOwn = (payload, field) => Object.prototype.hasOwnProperty.call(payload, field);

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const validateStringChoice = (field, value, choices) => {
  if (typeof value !== "string") {
    return {
      error: {
        field,
        message: "Value must be a string.",
        received: value,
      },
    };
  }

  const normalized = value.trim();

  if (!normalized) {
    return {
      error: {
        field,
        message: "Value must not be empty.",
        received: value,
      },
    };
  }

  if (!choices.includes(normalized)) {
    return {
      error: {
        field,
        message: `Value must be one of: ${choices.join(", ")}.`,
        received: value,
      },
    };
  }

  return {
    normalized,
  };
};

const validateIntRange = (field, value, minimum, maximum) => {
  const message = `Value must be an integer between ${minimum} and ${maximum}.`;

  if (typeof value === "boolean") {
    return {
      error: {
        field,
        message,
        received: value,
      },
    };
  }

  let normalized = value;

  if (typeof value === "string") {
    const stripped = value.trim();

    if (!/^\d+$/.test(stripped)) {
      return {
        error: {
          field,
          message,
          received: value,
        },
      };
    }

    normalized = Number(stripped);
  }

  if (!Number.isInteger(normalized) || normalized < minimum || normalized > maximum) {
    return {
      error: {
        field,
        message,
        received: value,
      },
    };
  }

  return {
    normalized,
  };
};

const predictDTO = (payload = {}) => {
  if (!isPlainObject(payload)) {
    throw new BadRequestError("Payload inválido", {
      errors: [
        {
          message: "Payload must be an object.",
          received: payload,
        },
      ],
    });
  }

  const receivedFields = Object.keys(payload);
  const errors = [];
  const predictionDTO = {};

  for (const field of forbiddenFields) {
    if (hasOwn(payload, field)) {
      errors.push({
        field,
        message: "Field is not accepted by this API.",
        received: payload[field],
      });
    }
  }

  for (const field of predictionFields) {
    if (!hasOwn(payload, field)) {
      errors.push({
        field,
        message: "Field is required.",
        received: null,
      });
    }
  }

  for (const field of receivedFields) {
    if (!predictionFields.includes(field) && !forbiddenFields.includes(field)) {
      errors.push({
        field,
        message: "Unexpected field.",
        received: payload[field],
      });
    }
  }

  for (const [field, choices] of Object.entries(categoricalChoices)) {
    if (!hasOwn(payload, field)) {
      continue;
    }

    const { normalized, error } = validateStringChoice(field, payload[field], choices);

    if (error) {
      errors.push(error);
    } else {
      predictionDTO[field] = normalized;
    }
  }

  for (const [field, [minimum, maximum]] of Object.entries(intRanges)) {
    if (!hasOwn(payload, field)) {
      continue;
    }

    const { normalized, error } = validateIntRange(field, payload[field], minimum, maximum);

    if (error) {
      errors.push(error);
    } else {
      predictionDTO[field] = normalized;
    }
  }

  if (errors.length > 0) {
    throw new BadRequestError("Dados inválidos para predição", {
      errors,
    });
  }

  return predictionFields.reduce((result, field) => {
    result[field] = predictionDTO[field];
    return result;
  }, {});
};

export {
  categoricalChoices,
  intRanges,
  predictionFields,
};

export default predictDTO;
