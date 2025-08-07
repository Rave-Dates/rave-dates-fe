import { useQuery } from "@tanstack/react-query";
import { getEventImages, getImageById } from "@/services/admin-events";

export function useEventImage({ eventId, token }: { eventId: number | undefined; token: string | undefined }) {
  const { data: eventImages } = useQuery({
    queryKey: [`eventImages-${eventId}`],
    queryFn: async () => {
      if (!token || !eventId) throw new Error("Token or eventId missing");
      return await getEventImages({ token, eventId });
    },
    enabled: !!eventId && !!token,
  });

  const { data: servedImageUrl, isLoading: isImageLoading } = useQuery({
    queryKey: [`servedImageUrl-${eventId}`],
    queryFn: async () => {
      if (!eventImages || eventImages.length === 0) return null;
      const blob = await getImageById({ token, imageId: Number(eventImages[0].imageId) });
      return URL.createObjectURL(blob);
    },
    enabled: !!eventImages && !!token,
  });

  return { servedImageUrl, isImageLoading };
}