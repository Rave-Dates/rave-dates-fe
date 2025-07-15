import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEvent, createEventCategories, createImage, createTicketTypes } from "../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { notifySuccess } from "@/components/ui/toast-notifications";

export function useCreateFullEvent(reset: () => void) {
  const { updateEventFormData, setHasLoadedTickets } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IEventFormData) => {
      const { eventCategoryValues ,tickets, images, ...eventData } = formData;

      // 1. Crear el evento
      const createdEvent = await createEvent(token, eventData);
      const eventId = createdEvent.eventId;

      console.log("eventId",eventId)

      // 2. Crear categorías
      console.log(eventCategoryValues)
      if (eventCategoryValues) {
        await Promise.all(
          eventCategoryValues.map((category) => {
            const formatData = {
              "categoryValueId": category.valueId,
            }
            createEventCategories(token, formatData, eventId)
          }
          )
        );
      }

      // 3. Crear tickets
      console.log(tickets)
      await Promise.all(
        tickets.map((ticket) =>{
          createTicketTypes(token, { ...ticket, eventId })
        }
        )
      );

      // // 3. Subir imágenes
      console.log("iamges",images)
      await Promise.all(
        images.map((file) => {
          console.log("file",file)
          if (!file.file) return;
          createImage(token, { eventId, file: file.file })
        })
      );
      
      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(); // reset React Hook Form
      setHasLoadedTickets(false);
   
      return createdEvent;
    },
    onSuccess: () => {
      router.push("/admin/events");
    },
    onError: (error) => {
      console.error("Error creando evento:", error);
      router.push("/admin/events");
    },
  });
}
