export function formatGeo(geoString: string, place: string): string {
  const [lat, lng] = geoString.split(",").map((part) => part.trim());
  return `${lat};${lng};${place.trim()}`;
}

export function extractPlaceFromGeo(geoString: string): string {
  const parts = geoString.split(";").map(part => part.trim());
  return parts.length === 3 ? parts[2] : "";
}

export function extractLatAndLng(geoString: string): string {
  const parts = geoString.split(";").map(part => part.trim());
  return parts.length === 3 ? `${parts[0]},${parts[1]}` : "";
}

export const validateGeo = (value: string): true | string => {
  const parts = value.split(",").map(p => p.trim());

  if (parts.length !== 2) return "Formato inválido. Use latitud;longitud";

  const [lat, lng] = parts;

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return "Latitud o longitud inválida. Deben ser números";
  }

  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    return "Coordenadas fuera de rango: lat [-90 a 90], lng [-180 a 180]";
  }

  return true;
};