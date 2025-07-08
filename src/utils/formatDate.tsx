export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().split("T")[0] || "";
};

export const formatToISO = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

export const validateDateYyyyMmDd = (value: string): true | string => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return "Formato inválido. Utilice YYYY-MM-DD";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Fecha inválida";
  return true;
};