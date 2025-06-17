import React from "react";
import Link from "next/link";
import EyeSvg from "@/components/svg/EyeSvg";

const DefaultButton = ({ href, text, className }: { href: string, text?: string, className?: string }) => {
  return (
    <Link
      href={href}
      className={`${className} bg-primary text-primary-black p-1.5 rounded-md flex items-center justify-center`}
      aria-label={`Ver ${href}`}
    >
      {
        text ? text : <EyeSvg />
      }
    </Link>
  );
};

export default DefaultButton;
