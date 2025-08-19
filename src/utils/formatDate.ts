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

export const formatDateToColombiaTime = (value: string | Date ) => {
  const dateUTC = new Date(value);
  
  // UTC-5 
  const offsetInMs = -5 * 60 * 60 * 1000;
  const colombiaDate = new Date(dateUTC.getTime() + offsetInMs);

  // Formato: "YYYY-MM-DD HH:mm"
  const yyyy = colombiaDate.getUTCFullYear();
  const mm = String(colombiaDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(colombiaDate.getUTCDate()).padStart(2, '0');
  const hh = String(colombiaDate.getUTCHours()).padStart(2, '0');
  const min = String(colombiaDate.getUTCMinutes()).padStart(2, '0');

  // Nuevo formato "Sáb, 16 ago 2025"
  const formatted = colombiaDate.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    date: `${yyyy}-${mm}-${dd}`, // → "2025-07-15"
    time: `${hh}:${min}`,        // → "16:30"
    formatted,                   // → "sáb, 16 ago 2025"
  }
};

export const formatColombiaTimeToUTC = (colombiaIso: string | Date): string => {
  const colombiaDate = new Date(colombiaIso);

  // Sumar 5 horas (Colombia está en UTC-5)
  const utcDate = new Date(colombiaDate.getTime() + 5 * 60 * 60 * 1000);

  return utcDate.toISOString(); // ISO en UTC
};

export const validateDateYyyyMmDd = (value: string | undefined): true | string | undefined => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value) return
  if (!regex.test(value)) return "Formato inválido. Utilice YYYY-MM-DD";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Fecha inválida";
  return true;
};