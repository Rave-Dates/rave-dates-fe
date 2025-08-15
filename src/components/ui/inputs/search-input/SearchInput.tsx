import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import SearchSvg from "../../../svg/SearchSvg";
import SearchResultItem from "./SearchInputItem";
import SearchGuestItem from "./SearchGuestItem";
import SearchUserItem from "./SearchUserItem";

type BaseProps = {
  handleFunc?: (item: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder: string;
  isLink?: boolean;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

type GuestProps = BaseProps & {
  type: "guest";
  results: IGuest[];
};

type EventProps = BaseProps & {
  type?: "event";
  results: IEvent[];
};

type UserProps = BaseProps & {
  type?: "user";
  results: IUser[];
};

type Props = GuestProps | EventProps | UserProps;

const SearchInput = ({
  handleFunc,
  value,
  placeholder,
  results,
  type,
  isLink,
  setSearchTerm,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cierra dropdown si clickea afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    setIsFocused(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <i className="absolute right-4 content-center h-full pointer-events-none">
        <SearchSvg />
      </i>
      <input
        ref={inputRef}
        value={value}
        onChange={handleFunc}
        onFocus={() => setIsFocused(true)}
        type="text"
        placeholder={placeholder}
        className="w-full bg-input placeholder:text-inactive outline-none text-body pl-4 pr-4 py-3.5 rounded-2xl"
      />

      {isFocused && results.length > 0 && (
        <ul className="absolute z-10 space-y-1 mt-2 w-full bg-main-container border border-divider rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {type === "event" &&
            results.map((event) => (
              <SearchResultItem
                key={event.eventId}
                event={event}
                onClick={handleSearchClick}
              />
            ))}

          {type === "guest" &&
            results.map((guest) => (
              <SearchGuestItem
                isLink={isLink}
                key={guest.clientId}
                guest={guest}
                onClick={handleSearchClick}
              />
            ))}

          {type === "user" &&
            results.map((user) => (
              <SearchUserItem
                key={user.userId}
                user={user}
                onClick={handleSearchClick}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
