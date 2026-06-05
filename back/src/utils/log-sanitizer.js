const SENSITIVE_FIELDS = ["password", "senha"];

const isPlainObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

const sanitizeLogValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeLogValue);
  }

  if (!isPlainObject(value)) {
    return value ?? null;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, currentValue]) => {
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        return [key, "[removido]"];
      }

      return [key, sanitizeLogValue(currentValue)];
    })
  );
};

export {
  isPlainObject,
  sanitizeLogValue,
};
