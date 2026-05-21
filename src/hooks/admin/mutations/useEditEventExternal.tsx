import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignOrganizerToEvent, createImage, deleteImage, editEvent, editEventCategories, getEventImages, activateExternalEvent, createEventCategories } from "../../../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC } from "@/utils/formatDate";

export function useEditEventExternal(reset: (data: IEventFormData) => void) {
  const { updateEventFormData } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: IEventFormData) => {
      const { categoriesToUpdate, categoriesToCreate, organizerId, images, eventId, date, time, geo, place, ...eventData } = formData;

      if (!eventId) return;

      // 1. Combinar fecha y hora
      let utcDate = "";
      if (date && time) {
        const validDate = combineDateAndTimeToISO(date, time);
        utcDate = formatColombiaTimeToUTC(validDate);
      }

      // 2. Formatear Geo
      const formattedGeo = `${geo};${place?.trim()}`;

      // 3. Asignar organizador
      if (organizerId) {
        await assignOrganizerToEvent(token, { organizerId }, eventId);
      }

      // 4. Editar el evento
      const cleanedEvent = {
        title: eventData.title,
        subtitle: eventData.subtitle || "",
        date: utcDate,
        geo: formattedGeo,
        quantityComplimentaryTickets: 0,
        description: eventData.description || "",
        externalUrl: eventData.externalUrl || "",
      };
      
      const editedEvent = await editEvent(token, eventId, cleanedEvent);

      // Usar el endpoint específico para activar o desactivar
      await activateExternalEvent(token, eventId, !!eventData.isActive);

      // 5. Editar las categorías
      if (categoriesToUpdate) {
        await Promise.all(
          categoriesToUpdate.map((category) => {
            if (!category) return;
            return editEventCategories(token, category, eventId).catch((err) => {
              console.error("Error en editEventCategories:", err.response?.data || err.message);
            });
          })
        );
      }

      if (categoriesToCreate) {
        await Promise.all(
          categoriesToCreate.map((category) => {
            if (!category) return;
            return createEventCategories(token, category, eventId).catch((err) => {
              console.error("Error en createEventCategories:", err.response?.data || err.message);
            });
          })
        );
      }

      // 6. Gestionar imágenes
      const currentImages = await getEventImages({ token, eventId });
      
      const imagesToDelete = currentImages.filter((currImg: IEventImages) => 
        !images.some((img: IImageData) => String(img.id) === String(currImg.imageId))
      );

      await Promise.all([
        ...imagesToDelete.map((img: IEventImages) => deleteImage(token, img.imageId)),
        ...images
          .filter((img): img is { id: string; url: string; file: File } => 'file' in img && !!img.file)
          .map((img) => createImage(token, { eventId, file: img.file }))
      ]);

      return editedEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
      queryClient.invalidateQueries({ queryKey: ["eventImages"] });
      queryClient.invalidateQueries({ queryKey: ["eventCategories"] });

      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(defaultEventFormData); // reset React Hook Form
    }
  });
}
