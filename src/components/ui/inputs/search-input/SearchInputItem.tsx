import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { useClientEventServedOneImage } from "@/hooks/client/queries/useClientData";
import Link from "next/link";

const SearchResultItem = ({ event, onClick }: { event: IEvent; onClick: () => void }) => {
  const { servedImageUrl, isImageLoading } = useClientEventServedOneImage(event.eventId);

  return (
    <li className="hover:bg-cards-container transition-colors">
      <Link
        href={`/event/${event.eventId}`}
        onClick={onClick}
        className="flex gap-3 items-center px-4 py-2 text-white text-sm"
      >
        {isImageLoading ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-cards-container">
            <SpinnerSvg className="w-3 h-3 fill-primary" />
          </div>
        ) : servedImageUrl ? (
          <img
            src={servedImageUrl}
            alt={event.title}
            className="w-10 h-10 rounded-md object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-700" />
        )}
        <div>
          <h2>{event.title}</h2>
          <h3 className="text-sm text-text-inactive">{event.subtitle}</h3>
        </div>
      </Link>
    </li>
  );
};

export default SearchResultItem;
