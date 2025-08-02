import { useQuery } from "@tanstack/react-query";
import { CookieValueTypes } from "cookies-next";
import { getAllEvents, getEventById, getEventCategoriesById, getTicketTypesById } from "@/services/admin-events";
import { getAllBinnaclesFromOrganizer } from "@/services/admin-binnacles";
import { getEventImages, getImageById } from "@/services/admin-events";
import { getAllCategories } from "@/services/admin-categories";
import { getAllLabels } from "@/services/admin-labels";
import { getAllUsers, getUserById } from "@/services/admin-users";
import { getAllRoles } from "@/services/admin-roles";
import { servedMovementImage } from "@/services/admin-payments";

export function useAdminEvent({ eventId, token }: { eventId: number; token: CookieValueTypes }) {
  const { data: selectedEvent, isLoading: isEventLoading } = useQuery<IEvent>({
    queryKey: [`selectedEvent-${eventId}`],
    queryFn: async () => {
      if (!token || !eventId) throw new Error("Token or eventId missing");
      const event = await getEventById({ token, id: eventId });
      return event;
    },
    enabled: !!eventId,
  });
  return { selectedEvent, isEventLoading };
}

export function useAdminAllEvents({ token }: { token: CookieValueTypes }) {
  const { data: allEvents, isLoading: isEventLoading, isError: isErrorEvent } = useQuery<IEvent[]>({
    queryKey: ["allEvents"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token,
  });

  return { allEvents, isEventLoading, isErrorEvent };
}

export function useAdminBinnacles({
  organizerId,
  token,
}: {
  organizerId: number | undefined;
  token: string | undefined;
}) {
  const { data: organizerBinnacles, isLoading: isBinnaclesLoading } = useQuery({
    queryKey: [`organizerBinnacles-${organizerId}`],
    queryFn: async () => {
      if (!token || !organizerId) throw new Error("Token or organizerId missing");
      const binnacles = await getAllBinnaclesFromOrganizer({ token, organizerId });
      return binnacles;
    },
    enabled: !!organizerId,
  });

  return { organizerBinnacles, isBinnaclesLoading };
}

export function useAdminEventCategories({
  eventId,
  token,
}: {
  eventId: number;
  token: CookieValueTypes;
}) {
  const { data: eventCategories } = useQuery<IEventCategoryValue[]>({
    queryKey: ["eventCategories"],
    queryFn: () => getEventCategoriesById(token, eventId),
    enabled: !!token,
  });

  return { eventCategories };
}

export function useAdminAllCategories({ token }: { token: CookieValueTypes }) {
  const { data: categories } = useQuery<IEventCategories[]>({
    queryKey: ["oldCategories"],
    queryFn: () => getAllCategories({ token }),
    enabled: !!token,
  });

  return { categories };
}

export function useAdminLabelsTypes({ token }: { token: CookieValueTypes }) {
  const { data: labelsTypes } = useQuery<IEventLabel[]>({
    queryKey: ["labelsTypes"],
    queryFn: () => getAllLabels({ token }),
    enabled: !!token,
  });

  return { labelsTypes };
}

export function useAdminTicketTypes({ token, eventId }: { token: CookieValueTypes, eventId: number }) {
  const { data: ticketTypes } = useQuery<IEventTicket[]>({
    queryKey: ["ticketTypes"],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token,
  });

  return { ticketTypes };
}

export function useAdminEventImages({
  eventId,
  token,
}: {
  eventId: number;
  token: CookieValueTypes;
}) {
  const { data: eventImages, isError: isErrorEventImages } = useQuery<IEventImages[]>({
    queryKey: ["eventImages", eventId],
    queryFn: () => getEventImages({ token, eventId }),
    enabled: !!token && !!eventId,
  });

  return { eventImages, isErrorEventImages };
}

export function useAdminImagesData({
  eventImages,
  token,
}: {
  eventImages?: IEventImages[];
  token: CookieValueTypes;
}) {
  const {
    data: imagesData,
    isLoading: loadingImages,
    isError: errorImages,
  } = useQuery<IImageData[]>({
    queryKey: ["imagesData", eventImages?.map((img) => img.imageId)],
    queryFn: async () => {
      if (!eventImages || !token) return [];

      const processedImages = await Promise.all(
        eventImages.map(async (img) => {
          const blob = await getImageById({ token, imageId: img.imageId });
          const url = URL.createObjectURL(blob);

          return {
            id: img.imageId.toString(),
            url,
          };
        })
      );

      return processedImages;
    },
    enabled: !!token && !!eventImages,
  });

  return { imagesData, loadingImages, errorImages };
}

export function useAdminAllUsers({ token }: { token: CookieValueTypes }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers({ token }),
    enabled: !!token,
  });

  return { data, isLoading, isError };
}

export function useAdminUserById({ token, userId }: { token: CookieValueTypes, userId: number }) {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token,
  });

  return { data, isPending };
}

export function useAdminAllRoles({ token }: { token: CookieValueTypes }) {
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ token }),
    enabled: !!token,
  });

  return { roles };
}

export function useServeMovementImage({ token, url }: { token: CookieValueTypes, url?: string  }) {
  const { data: movementImage, isError: isErrorMovementImage, isLoading: isLoadingMovementImage } = useQuery({
    queryKey: ["movementImage", url],
    queryFn: () => servedMovementImage({ token, url: url! }),
    enabled: !!token && !!url,
  });

  return { movementImage, isErrorMovementImage, isLoadingMovementImage };
}