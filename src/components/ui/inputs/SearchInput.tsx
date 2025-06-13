import React, { ChangeEvent } from "react";
import SearchSvg from "../../svg/SearchSvg";

const SearchInput = ({
  handleFunc = undefined,
  value,
  placeholder,
}: {
  handleFunc?: (item: ChangeEvent<HTMLInputElement>) => void | undefined;
  value?: string;
  placeholder: string;
}) => {
  return (
    <div className="relative w-full">
      <i className="absolute right-4 content-center h-full">
        <SearchSvg />
      </i>
      <input
        value={value}
        onChange={handleFunc}
        type="text"
        placeholder={placeholder}
        className="w-full bg-input placeholder:text-inactive outline-none text-body pl-4 pr-4 py-3.5 rounded-2xl"
      />
    </div>
  );
};

export default SearchInput;
