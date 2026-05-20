import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { assignOrganizerToEvent, createExternalEvent, createImage } from "../../../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC } from "@/utils/formatDate";

export function useCreateExternalEvent({ reset, successHref = "/admin/events", errorHref = "/admin/events" }: { reset: (data: IEventFormData) => void, successHref?: string, errorHref?: string }) {
  const { updateEventFormData } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IEventFormData) => {
      const { title, subtitle, date, time, geo, place, description, externalUrl, categories, images, organizerId } = formData;

      // 1. Combinar fecha y hora
      let utcDate = "";
      if (date && time) {
        const validDate = combineDateAndTimeToISO(date, time);
        utcDate = formatColombiaTimeToUTC(validDate);
      }

      // 2. Formatear Geo
      const formattedGeo = `${geo};${place?.trim()}`;

      // 3. Procesar categorías
      const categoriesList = categories as unknown as string[] | undefined;
      const parsedCategories = categoriesList
        ? categoriesList
            .filter((c): c is string => typeof c === 'string' && c !== "")
            .map((category) => JSON.parse(category))
        : [];
      const categoryValueIds = parsedCategories.map((c: any) => c.valueId);

      // 4. Crear payload
      const payload = {
        title,
        subtitle,
        date: utcDate,
        geo: formattedGeo,
        description: description || "",
        externalUrl,
        categoryValueIds,
      };

      // 5. Llamar endpoint externo
      const createdEvent = await createExternalEvent(token, payload);
      const eventId = createdEvent.eventId;

      // 6. Asignar organizador (si aplica)
      if (organizerId && eventId) {
        await assignOrganizerToEvent(token, { organizerId }, eventId);
      }

      // 7. Subir imágenes (si aplica)
      if (images && eventId) {
        await Promise.all(
          images
            .filter((img): img is { id: string; url: string; file: File } => 'file' in img && !!img.file)
            .map((img) => createImage(token, { eventId, file: img.file }))
        );
      }

      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(defaultEventFormData); // reset React Hook Form

      return createdEvent;
    },
    onSuccess: () => {
      router.push(successHref);
    },
    onError: (error) => {
      console.error("Error creando evento externo:", error);
      router.push(errorHref);
    },
  });
}
