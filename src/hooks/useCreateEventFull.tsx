import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createEvent, createEventCategories, createImage, createTicketTypes } from "../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";

export function useCreateFullEvent(reset: (data: IEventFormData) => void) {
  const { updateEventFormData, setHasLoadedTickets } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IEventFormData) => {
      const { eventCategoryValues ,tickets, images, ...eventData } = formData;

      // 1. Crear el evento
      const validLabels = eventData.labels?.map((label) => (label.labelId));
      const cleanedEvent = {
        ...eventData,
        labels: validLabels,
      };
      console.log("cleandedEvent desde el hook",cleanedEvent)
      const createdEvent = await createEvent(token, cleanedEvent);
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
        images
          .filter((img): img is { id: string; url: string; file: File } => 'file' in img && !!img.file)
          .map((img) => createImage(token, { eventId, file: img.file }))
      );
      
      updateEventFormData(defaultEventFormData); // reset Zustand
      reset(defaultEventFormData); // reset React Hook Form
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
