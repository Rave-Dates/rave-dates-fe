import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignOrganizerToEvent, assignPromoterToEvent, createImage, createTicketTypes, deleteImage, editEvent, editEventCategories, editTicketTypes, getEventImages, createEventCategories } from "../../../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";

export function useEditEvent(reset: (data: IEventFormData) => void) {
  const { updateEventFormData, setHasLoadedTickets } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({formData, isOrganizer = false}: { formData: IEventFormData, isOrganizer?: boolean }) => {
      const { categoriesToUpdate, categoriesToCreate, organizerId, tickets, images, formPromoters, eventId, ...eventData } = formData;

      if (!eventId) return
      
      if (formData.organizerId) {
        await assignOrganizerToEvent(token, { organizerId: formData.organizerId }, eventId);
      }

      if (formPromoters) {
        const formattedData = {
          promoters: 
            formPromoters?.map((promoter) => ({
              promoterId: promoter.promoterId || 0,
            })) || []
          ,
        };
        
        console.log("formattedData", formattedData)
        await assignPromoterToEvent(token, formattedData, eventId);
      }

      // 1. Editar el evento
      const validLabels = eventData.labels?.map((label) => (label.labelId));
      const cleanedEvent = {
        ...eventData,
        labels: validLabels,
      };
      const editedEvent = await editEvent(token, eventId, cleanedEvent);

      // console.log("eventId",eventId)

      // 2. Editar o crear los tickets
      console.log("tickets desde hook",tickets)
      await Promise.all(
        tickets.map(({ ticketTypeId, ticketId, ...rest }) => {
          const ticketValues = { ...rest };
          if (ticketTypeId) {
            // Ticket existente → editar
            return editTicketTypes(token, ticketValues, ticketTypeId);
          } else {
            // Ticket nuevo → crear
            return createTicketTypes(token, { ...ticketValues, eventId });
          }
        })
      );

      // 3. Editar las categorías
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

      // 4. Gestionar imágenes
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
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
      queryClient.invalidateQueries({ queryKey: ["eventImages"] });
      queryClient.invalidateQueries({ queryKey: ["eventCategories"] });

      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(defaultEventFormData); // reset React Hook Form
      setHasLoadedTickets(false);
    }
  });
}
