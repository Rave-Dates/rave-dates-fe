const errorMap: { [key: string]: string } = {
  "Event must have an organizer": "El evento debe tener un organizador asignado",
  "Unauthorized": "Sesión expirada o no autorizada",
  "Forbidden": "No tienes permisos para realizar esta acción",
  "Internal Server Error": "Error interno del servidor",
  "Network Error": "Error de conexión de red",
  "Bad Request": "Solicitud incorrecta",
  "Not Found": "Recurso no encontrado",
  "Sold out": "Tickets agotados",
  "Event is not active": "El evento no está activo",
  "User already exists": "El usuario ya existe",
};

export const translateError = (message: string): string => {
  return errorMap[message] || message;
};
