export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().split("T")[0] || "";
};

export function combineDateAndTimeToISO(date: string, time: string): string {
  const isoString = new Date(`${date}T${time}:00Z`).toISOString();
  return isoString;
}
export function parseISODate(isoDate: string) {
  const date = new Date(isoDate);

  const yyyyMmDd = date.toISOString().split("T")[0];
  const hhMm = date.toISOString().split("T")[1].slice(0, 5);

  return {
    date: yyyyMmDd, // → "2025-07-15"
    time: hhMm,      // → "16:30"
  };
}

export const validateDateYyyyMmDd = (value: string | undefined): true | string | undefined => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value) return
  if (!regex.test(value)) return "Formato inválido. Utilice YYYY-MM-DD";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Fecha inválida";
  return true;
};