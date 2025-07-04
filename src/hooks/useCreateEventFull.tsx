import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEvent, createImage, createTicketTypes } from "../services/admin-events";
import { useReactiveCookiesNext } from "cookies-next";
import { useCreateEventStore } from "@/store/createEventStore";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { notifySuccess } from "@/components/ui/toast-notifications";

export function useCreateFullEvent(reset: () => void) {
  const { updateEventFormData } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData) => {
      const { tickets, images, ...eventData } = formData;

      // 1. Crear el evento
      const createdEvent = await createEvent(token, eventData);
      const eventId = createdEvent.eventId;

      console.log("eventId",eventId)

      // // 2. Crear tickets
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
        images.map((file) => createImage(token, { eventId, file: file.file }))
      );
      
      const resetData = {
        ...defaultEventFormData,
        eventId: crypto.randomUUID(),
      };
      useCreateEventStore.getState().updateEventFormData(resetData); // reset Zustand
      reset(resetData); // reset React Hook Form
   
      return createdEvent;
    },
    onSuccess: () => {
      notifySuccess('Evento creado correctamente');
      router.push("/admin/events");
    },
    onError: (error) => {
      console.error("Error creando evento:", error);
      toast.error("Error al crear el evento.");
    },
  });
}
