import React from "react";
import Link from "next/link";
import EyeSvg from "@/components/svg/EyeSvg";

const DefaultButton = ({ href, text, className, icon = <EyeSvg /> }: { href: string, text?: string, className?: string, icon?: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className={`${className} bg-primary text-primary-black p-1.5 rounded-md flex items-center justify-center`}
      aria-label={`Ver ${href}`}
    >
      {
        text ? text : icon
      }
    </Link>
  );
};

export default DefaultButton;
