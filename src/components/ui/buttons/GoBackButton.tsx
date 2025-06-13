import React from "react";
import Link from "next/link";
import ArrowSvg from "../../svg/ArrowSvg";

const GoBackButton = ({ className }: { className?: string }) => {
  return (
    <Link
      className={`${className} bg-primary text-primary-black rounded-xl`}
      href="/"
    >
      <ArrowSvg />
    </Link>
  );
};

export default GoBackButton;
