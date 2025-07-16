"use client"

import { StageCard } from "@/components/roles/admin/StageCard";
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useCreateEventStore } from "@/store/createEventStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function StageConfig() {
 const { eventFormData, updateEventFormData, editingTicketId, hasLoadedEvent } = useCreateEventStore();

  const router = useRouter()
  const params = useParams()
  const eventId = Number(params.eventId)

  const currentTicketIndex = eventFormData.tickets?.findIndex(
    (t) => t.ticketTypeId === editingTicketId
  );

  const currentStages = eventFormData.tickets?.[currentTicketIndex!]?.stages || [];
  
  const { control, register, handleSubmit, getValues, reset } = useForm<IEventTicket>({
    defaultValues: { stages: currentStages }
  });

  
  useEffect(() => {
    if (currentStages.length) {
        reset({ stages: currentStages });
      }
    }, [currentStages]);

  useEffect(() => {
    if (!hasLoadedEvent) {
      notifyError("Por favor vuelva a seleccionar un ticket")
      router.push(`/admin/events/edit-event/${eventId}`)
    }
  });

      
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  });
  
  const onSubmit = (data: IEventTicket) => {
    if (!eventFormData.tickets) return
    const updatedTickets = [...eventFormData.tickets];
    updatedTickets[currentTicketIndex!] = {
      ...updatedTickets[currentTicketIndex!],
      stages: data.stages
    };
    console.log("updated tickets",updatedTickets)
    
    updateEventFormData({
      ...eventFormData, // ← esto mantiene title, images, etc.
      tickets: updatedTickets,
    });
    notifySuccess('Etapa actualizada correctamente');
    router.back()
  };

  const handleAddStage = () => {
    const currentStages = getValues("stages");
    const newId = (currentStages?.at(-1)?.stageId ?? 0) + 1;

    const today = new Date();
    const yyyyMmDd = today.toISOString().split('T')[0];

    const newStage = {
      stageId: newId,
      dateMax: "",
      price: 0,
      quantity: 0,
      date: yyyyMmDd,
    };

    // Agrega el stage al hook de formulario (React Hook Form)
    append(newStage);

    // También actualiza el estado global (Zustand)
    if (!eventFormData.tickets) return
    const updatedTickets = [...eventFormData.tickets];
    const ticketIndex = updatedTickets.findIndex(t => t.ticketTypeId === editingTicketId);

    if (ticketIndex !== -1) {
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        stages: [...(updatedTickets[ticketIndex].stages || []), newStage],
      };

      updateEventFormData({
        ...eventFormData, // ← esto mantiene title, images, etc.
        tickets: updatedTickets,
      });
    }
  };

  const handleDeleteStage = (index: number) => {
    if (fields.length === 1) return;

    // 1. Eliminar del form (React Hook Form)
    remove(index);

    // 2. Eliminar del estado global (Zustand)
    if (!eventFormData.tickets) return
    const updatedTickets = [...eventFormData.tickets];
    const ticketIndex = updatedTickets.findIndex(t => t.ticketTypeId === editingTicketId);

    if (ticketIndex !== -1) {
      const updatedStages = [...(updatedTickets[ticketIndex].stages || [])];
      updatedStages.splice(index, 1); // eliminar stage por índice

      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        stages: updatedStages,
      };

      updateEventFormData({ tickets: updatedTickets });
    }
  };

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />

      <div className="max-w-md mx-auto space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-title font-bold mb-6">Configurar etapas</h1>

          {/* Ticket Cards */}
          <div className="space-y-4">
            {fields.map((stage, index) => (
              <StageCard
                register={register}
                key={stage.id}
                index={index}
                onDelete={() => handleDeleteStage(index)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleAddStage()}
            className="w-full border outline-none border-primary text-primary font-medium py-5 rounded-lg flex items-center justify-center gap-2"
          >
            Agregar etapa
          </button>

          <button
            className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  )
}
