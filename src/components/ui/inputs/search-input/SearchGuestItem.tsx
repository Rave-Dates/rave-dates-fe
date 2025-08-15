import Link from "next/link";

const SearchGuestItem = ({ guest, onClick, isLink = true }: { guest: IGuest; onClick: () => void, isLink?: boolean }) => {
  return (
    <li className="hover:bg-cards-container transition-colors">
      {
        isLink ?
        <Link
          href={`/event/${guest.clientId}`}
          onClick={onClick}
          className="flex flex-col gap-3 items-start px-4 py-2 text-white text-sm"
        >
          <div>
            <h2>{guest.name}</h2>
            <h3 className="text-sm text-text-inactive">{guest.email}</h3>
          </div>
        </Link>
        :
        <div
          className="flex flex-col gap-3 items-start px-4 py-2 text-white text-sm"
        >
          <div>
            <h2>{guest.name}</h2>
            <h3 className="text-sm text-text-inactive">{guest.email}</h3>
          </div>
        </div>
      }
    </li>
  );
};

export default SearchGuestItem;
