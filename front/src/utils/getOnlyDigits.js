const getOnlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

export default getOnlyDigits;
