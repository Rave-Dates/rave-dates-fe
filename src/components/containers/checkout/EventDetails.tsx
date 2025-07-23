import { formatDateToColombiaTime } from "@/utils/formatDate";
import TitleCard from "../../common/TitleCard";
import { extractPlaceFromGeo } from "@/utils/formatGeo";
import Image from "next/image";
import { getClientEventImagesById, getClientImageById } from "@/services/clients-events";
import { useQuery } from "@tanstack/react-query";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

type Props = {
  className?: string;
  selectedEvent: IEvent;
  eventId: number;
};

export default function EventDetails({className, selectedEvent, eventId}: Props) {
  // const { data: eventImages } = useQuery<IEventImages[]>({
  //   queryKey: [`eventImages-${eventId}`],
  //   queryFn: () => getClientEventImagesById(eventId),
  //   enabled: !!eventId,
  // });

  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: async () => {
      const images = await getClientEventImagesById(eventId);
      return images
    },
    enabled: !!eventId,
  });

  const { data: servedImageUrl, isLoading } = useQuery<string | null>({
    queryKey: [`servedImageUrl-${eventId}`],
    queryFn: async () => {
      if (!eventImages) return null;
      const blob = await getClientImageById(Number(eventImages[0].imageId));
      return URL.createObjectURL(blob);
    },
    enabled: !!eventImages,
  });

  return (
    <div className={`${className} bg-cards-container rounded-lg p-4`}>
      <TitleCard className="b-2 pb-2 mb-4 border-dashed border-inactive border-b-2" title={selectedEvent.title} description={selectedEvent.subtitle}>
        {
          isLoading ?
          <div className="w-14 h-14 flex items-center justify-center">
            <SpinnerSvg className='fill-primary text-inactive w-5' />
          </div>
          :
          <Image
            className="w-14 h-14 rounded"
            src={servedImageUrl ?? "/images/event-placeholder.png"}
            width={1000}
            height={1000}
            alt="logo"
          />
        }
      </TitleCard>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-primary-white/50">Fecha y hora</span>
          <span className="text-end">{formatDateToColombiaTime(selectedEvent.date).date} {formatDateToColombiaTime(selectedEvent.date).time}hs (COL)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary-white/50">Ubicación</span>
          <span className="text-end">{extractPlaceFromGeo(selectedEvent.geo)}</span>
        </div>
      </div>
    </div>
  );
}
