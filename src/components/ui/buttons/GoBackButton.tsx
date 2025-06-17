"use client"

import React from "react";
import ArrowSvg from "../../svg/ArrowSvg";
import { useRouter } from "next/navigation";

const GoBackButton = ({ className }: { className?: string }) => {
  const router = useRouter()

  return (
    <button
      className={`${className} bg-primary text-primary-black rounded-xl`}
      onClick={() => router.back()}
    >
      <ArrowSvg />
    </button>
  );
};

export default GoBackButton;
