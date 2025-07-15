import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createImage, createTicketTypes, editEvent, editEventCategories, editTicketTypes } from "../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { notifySuccess } from "@/components/ui/toast-notifications";

export function useEditEvent(reset: () => void) {
  const { updateEventFormData, setHasLoadedTickets } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IEventFormData) => {
      const { categoriesToUpdate, tickets, images, eventId, ...eventData } = formData;

      if (!eventId) return

      // 1. Editar el evento
      console.log("eventDataA",eventData)
      const editedEvent = await editEvent(token, eventId, eventData);

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
          categoriesToUpdate.map((category) =>
            editEventCategories(token, category, eventId)
          )
        );
      }

      // 4. Subir imágenes
      console.log("iamges",images)
      await Promise.all(
        images.map((file) => file.file && createImage(token, { eventId, file: file.file }))
      );
      
      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(); // reset React Hook Form
      setHasLoadedTickets(false);
   
      return editedEvent;
    }
  });
}
