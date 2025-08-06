import { useMutation } from "@tanstack/react-query";
import { assignPromoterToEvent, createImage, editEvent, editEventCategories, editTicketTypes } from "../../../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";

export function useEditEvent(reset: (data: IEventFormData) => void) {
  const { updateEventFormData, setHasLoadedTickets } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  return useMutation({
    mutationFn: async ({formData, isOrganizer = false}: { formData: IEventFormData, isOrganizer?: boolean }) => {
      const { categoriesToUpdate, tickets, images, formPromoters, eventId, ...eventData } = formData;

      if (!eventId) return

      if (isOrganizer) {
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

      // 2. Editar los tickets
      console.log("tickets desde hook",tickets)
      await Promise.all(
        tickets.map(({ ticketTypeId, ...rest }) => {
          const ticketValues = { ...rest };
          if (!ticketTypeId) return;
          return editTicketTypes(token, ticketValues, ticketTypeId);
        })
      );

      // 3. Editar las categorías
      if (categoriesToUpdate) {
        await Promise.all(
          categoriesToUpdate.map((category) => {
            if (!category) return;
            editEventCategories(token, category, eventId)
          })
        );
      }

      // 4. Subir imágenes
      console.log("iamges",images)
      await Promise.all(
        images
          .filter((img): img is { id: string; url: string; file: File } => 'file' in img && !!img.file)
          .map((img) => createImage(token, { eventId, file: img.file }))
      );
      
      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(defaultEventFormData); // reset React Hook Form
      setHasLoadedTickets(false);
   
      return editedEvent;
    }
  });
}
