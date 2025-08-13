import { useQuery } from "@tanstack/react-query";
import { CookieValueTypes } from "cookies-next";
import { getAllEvents, getCheckerTicketMetrics, getEventById, getEventCategoriesById, getPromoterTicketMetrics, getTicketMetrics, getTicketTypesById } from "@/services/admin-events";
import { getAllBinnaclesFromOrganizer, getAllBinnaclesFromPromoter } from "@/services/admin-binnacles";
import { getEventImages, getImageById } from "@/services/admin-events";
import { getAllCategories } from "@/services/admin-categories";
import { getAllLabels } from "@/services/admin-labels";
import { getAllCheckers, getAllCheckerUsers, getAllPromoters, getAllUsers, getGuests, getPromoterLink, getUserById } from "@/services/admin-users";
import { getAllRoles } from "@/services/admin-roles";
import { getAllPayments, servedMovementImage } from "@/services/admin-payments";

export function useAdminEvent({ eventId, token }: { eventId: number | undefined; token: CookieValueTypes }) {
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

export function useAdminPayments({ token }: { token: CookieValueTypes }) {
  const { data: payments } = useQuery<IPaymentData[]>({
    queryKey: ["payments"],
    queryFn: () => getAllPayments({ token }),
    enabled: !!token,
  });

  return { payments };
}

export function useAdminPromoterBinnacles({
  promoterId,
  token,
}: {
  promoterId: number | undefined;
  token: string | undefined;
}) {
  const { data: promoterBinnacles, isLoading: isBinnaclesLoading } = useQuery({
    queryKey: [`promoterBinnacles-${promoterId}`],
    queryFn: async () => {
      if (!token || !promoterId) throw new Error("Token or promoterId missing");
      const binnacles = await getAllBinnaclesFromPromoter({ token, promoterId });
      return binnacles;
    },
    enabled: !!promoterId && !!token,
  });

  return { promoterBinnacles, isBinnaclesLoading };
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
    enabled: !!organizerId && !!token,
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
    queryKey: ["ticketTypes", eventId],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token && !!eventId,
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

export function useAdminAllCheckerUsers({ token, eventId }: { token: CookieValueTypes | Promise<CookieValueTypes>, eventId: number }) {
  const { data: checkerUsers, isLoading, isError } = useQuery({
    queryKey: ["checkerUsers"],
    queryFn: () => getAllCheckerUsers({ token, eventId }),
    enabled: !!token && !!eventId,
  });

  return { checkerUsers, isLoading, isError };
}

export function useAdminAllPromoters({ token, organizerId }: { token: CookieValueTypes, organizerId: number | null | undefined }) {
  const { data: promoters, isLoading, isError } = useQuery({
    queryKey: ["promoters"],
    queryFn: () => getAllPromoters({ token, organizerId: organizerId! }),
    enabled: !!token && !!organizerId,
  });

  return { promoters, isLoading, isError };
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
  const { data: roles } = useQuery<IRole[]>({
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

export function useAdminTicketMetrics({ token, eventId, isPromoter = false }: { token: CookieValueTypes, eventId: number | undefined, isPromoter?: boolean }) {
  const { data: ticketMetrics } = useQuery<IEventTicketMetrics>({
    queryKey: ["ticketMetrics", eventId],
    queryFn: () => getTicketMetrics(token, eventId!),
    enabled: !!token && !!eventId && !isPromoter,
  });

  return { ticketMetrics };
}

export function useAdminPromoterTicketMetrics({ token, eventId, promoterId }: { token: CookieValueTypes, eventId: number | undefined, promoterId: number | undefined }) {
  const { data: promoterTicketMetrics } = useQuery<IEventTicketMetrics>({
    queryKey: ["promoterTicketMetrics", eventId],
    queryFn: () => getPromoterTicketMetrics(token, eventId!, promoterId!),
    enabled: !!token && !!eventId && !!promoterId,
  });

  return { promoterTicketMetrics };
}

export function useAdminCheckerTicketMetrics({ token, eventId }: { token: CookieValueTypes | null, eventId: number | undefined }) {
  const { data: checkerTicketMetrics } = useQuery<IEventCheckerTicketMetrics>({
    queryKey: ["checkerTicketMetrics", eventId],
    queryFn: () => getCheckerTicketMetrics({token: token!, eventId: eventId!}),
    enabled: !!token && !!eventId,
  });

  return { checkerTicketMetrics };
}

export function useAdminGetGuests({ token, eventId }: { token: CookieValueTypes, eventId: number }) {
  const { data: guests } = useQuery<IGuest[]>({
    queryKey: ["guests", eventId],
    queryFn: () => getGuests({ token, eventId }),
    enabled: !!token && !!eventId,
  });

  return { guests };
}

export function useAdminGetPromoterLink({ token, eventId, promoterId }: { token: CookieValueTypes, eventId: number, promoterId: number | undefined }) {
  const { data: promoterLink } = useQuery<string>({
    queryKey: ["promoterLink", eventId, promoterId],
    queryFn: () => getPromoterLink({ token, eventId, promoterId: promoterId! }),
    enabled: !!token && !!eventId && !!promoterId,
  });

  return { promoterLink };
}

export function useAdminGetCheckers({ token }: { token: CookieValueTypes }) {
  const { data: allCheckers } = useQuery<IUser[]>({
    queryKey: ["allCheckers"],
    queryFn: () => getAllCheckers({ token }),
    enabled: !!token,
  });

  return { allCheckers };
}