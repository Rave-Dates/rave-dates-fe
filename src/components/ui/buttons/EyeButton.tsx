import React from "react";
import Link from "next/link";
import EyeSvg from "@/components/svg/EyeSvg";

const EyeButton = ({ userId, href }: { userId: number, href: string }) => {
  return (
    <Link
      href={`${href}/${userId}`}
      className="bg-primary text-primary-black p-1.5 rounded-md flex items-center justify-center"
      aria-label={`Ver ${userId}`}
    >
      <EyeSvg />
    </Link>
  );
};

export default EyeButton;
