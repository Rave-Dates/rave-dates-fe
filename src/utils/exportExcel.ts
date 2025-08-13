import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportGuestsToExcel = (guests: IGuest[]) => {
  const data = guests.map((guest) => ({
    Nombre: guest.name,
    Email: guest.email || "",    
    Teléfono: guest.whatsapp || "",
    Cédula: guest.idCard || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Invitados");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "lista_invitados.xlsx");
};
