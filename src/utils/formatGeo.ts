export function extractPlaceFromGeo(geoString: string): string {
  if (!geoString) return "";
  const parts = geoString.split(";").map(part => part.trim());
  if (parts.length === 3) return parts[2];
  if (parts.length === 2 && parts[0] === "") return parts[1];
  if (parts.length === 1 && !parts[0].includes(",")) return parts[0];
  return "";
}

export function extractLatAndLng(geoString: string): string {
  if (!geoString) return "";
  const parts = geoString.split(";").map(part => part.trim());
  
  if (parts.length >= 2 && parts[0] && parts[1]) {
    // If it is 'lat,lng', convert it just in case, otherwise use as is
    const lat = parts[0].replace(',', '.');
    const lng = parts[1].replace(',', '.');
    return `${lat};${lng}`;
  }
  
  // Backwards compatibility if it was somehow saved as "lat,lng" without semicolons
  if (parts.length === 1 && geoString.includes(",")) {
    const commaParts = geoString.split(",").map(p => p.trim());
    if (commaParts.length === 2 && commaParts[0] && commaParts[1]) {
      return `${commaParts[0]};${commaParts[1]}`;
    }
  }

  return "";
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