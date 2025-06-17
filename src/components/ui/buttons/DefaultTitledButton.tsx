import Link from "next/link";
import React from "react";

const DefaultTitledButton = ({
  className,
  handleOnClick,
  children,
  href,
}: {
  className?: string;
  handleOnClick?: () => void;
  children?: React.ReactNode;
  href?: string;
}) => {
  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${className} bg-primary text-black px-2 py-1 min-w-[65px] justify-items-center rounded-md flex flex-col items-center justify-center hover:opacity-80 transition-opacity`}
          aria-label={`Ver ${href}`}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={handleOnClick}
          className={`${className} bg-primary text-black px-2 py-1 min-w-[65px] justify-items-center rounded-md flex flex-col items-center justify-center hover:opacity-80 transition-opacity`}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default DefaultTitledButton;
