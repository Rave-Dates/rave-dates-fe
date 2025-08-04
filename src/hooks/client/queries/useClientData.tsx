import { useQuery } from "@tanstack/react-query";
import {
  getAllClientCategories,
  getAllClientEvents,
  getClientEventById,
  getClientEventImagesById,
  getClientImageById,
  getEventClientTickets
} from "@/services/clients-events";
import { getClientById } from "@/services/clients-login";
import { CookieValueTypes } from "cookies-next";
import { getTicketFromClientById, getTicketsFromClient } from "@/services/clients-tickets";
import { useEventStore } from "@/store/useEventStore";

export function useClientEvent(eventId?: number) {
  const { data: selectedEvent, isLoading: isEventLoading } = useQuery({
    queryKey: [`selectedEvent-${eventId}`],
    queryFn: () => getClientEventById(eventId!),
    enabled: !!eventId,
  });
  
  return { selectedEvent, isEventLoading };
}

export function useClientGetById({clientId, clientToken} : { clientId: number | undefined | null, clientToken: CookieValueTypes }) {
  const { data: clientData } = useQuery<IClient | null>({
    queryKey: ['clientData', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      return await getClientById({id: clientId, token: clientToken});
    },
    enabled: !!clientId,
  });
  
  return { clientData };
}

export function useClientPurchasedTickets({clientId, clientToken} : { clientId: number, clientToken: CookieValueTypes }) {
  const { data: purchasedTickets, isLoading: isTicketsLoading, isError: isTicketsError } = useQuery<IPurchaseTicket[]>({
    queryKey: ["purchasedTickets", clientId],
    queryFn: async () => {
      if (!clientToken) throw new Error("clientToken missing");
      return await getTicketsFromClient(clientId, clientToken);
    },
    enabled: !!clientToken && !!clientId,
  });
  
  return { purchasedTickets, isTicketsLoading, isTicketsError };
}

export function useClientPurchasedOneTicket({pruchaseTicketId, clientToken} : { pruchaseTicketId: number, clientToken: CookieValueTypes }) {
  const { data: purchasedTicket, isLoading: isTicketLoading, isError: isTicketError } = useQuery<IPurchaseTicket>({
    queryKey: ["purchasedTicket", pruchaseTicketId],
    queryFn: async () => {
      if (!clientToken) throw new Error("clientToken missing");
      return await getTicketFromClientById({pruchaseTicketId: pruchaseTicketId, token: clientToken});
    },
    enabled: !!clientToken && !!pruchaseTicketId,
  });
  
  return { purchasedTicket, isTicketLoading, isTicketError };
}

export function useClientAllEvents({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const { filters } = useEventStore();

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery<IEvent[], Error>({
    queryKey: ["clientEvents", limit, filters],
    queryFn: () => getAllClientEvents(page, limit, filters),
  });

  return { data, isLoading, isError, isFetching };
}

export function useClientAllRawEvents() {
  return useQuery<IEvent[]>({
    queryKey: ['raw-events'],
    queryFn: () => getAllClientEvents(1, 1000),
  });
};

export function useClientEventTickets(eventId?: number) {
  const { data: eventTickets, isLoading: isTicketsLoading } = useQuery<IEventTicket[]>({
    queryKey: ["eventTickets", eventId],
    queryFn: () => getEventClientTickets(eventId!),
    enabled: !!eventId,
  });

  return { eventTickets, isTicketsLoading };
}

export function useClientEventServedImages(eventId?: number) {
  const { data: eventImages } = useQuery<IEventImages[]>({
     queryKey: [`eventImages-${eventId}`],
     queryFn: () => eventId ? getClientEventImagesById(eventId) : [],
     enabled: !!eventId,
   });
 
  const { data: servedImages, isLoading: isImagesLoading } = useQuery<{ id: string, url: string }[]>({
    queryKey: [`servedImages-${eventId}`, eventImages?.map(img => img.imageId)],
    enabled: !!eventImages,
    queryFn: async () => {
      if (!eventImages) return [];
      const processedImages = await Promise.all(
        eventImages?.map(async (img) => {
          const blob = await getClientImageById(img.imageId);
          const url = URL.createObjectURL(blob);
          
          return {
            id: String(img.imageId),
            url,
          };
        })
      );

      return processedImages;
    },
  });

  return {
    servedImages: servedImages ?? [],
    isImagesLoading,
  };
}

export function useClientEventServedOneImage(eventId?: number) {
  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: async () => {
      if (!eventId) return [];
      const images = await getClientEventImagesById(eventId);
      return images
    },
    enabled: !!eventId,
  });

  const { data: servedImageUrl, isLoading: isImageLoading } = useQuery<string | null>({
    queryKey: [`servedImageUrl-${eventId}`],
    queryFn: async () => {
      if (!eventImages) return null;
      const blob = await getClientImageById(Number(eventImages[0].imageId));
      return URL.createObjectURL(blob);
    },
    enabled: !!eventImages,
  });

  return {
    servedImageUrl: servedImageUrl,
    isImageLoading,
  };
}

export function useClientAllCategories() {
  const { data: clientCategories, isLoading: isCategoriesLoading } = useQuery<IEventCategories[]>({
    queryKey: ["clientCategories"],
    queryFn: () => getAllClientCategories(),
  });

  return { clientCategories, isCategoriesLoading };
}