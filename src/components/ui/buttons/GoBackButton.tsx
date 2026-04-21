"use client"

import React from "react";
import ArrowSvg from "../../svg/ArrowSvg";
import { useRouter } from "next/navigation";

const GoBackButton = ({ className, goHomeButton }: { className?: string, goHomeButton?: boolean }) => {
  const router = useRouter()

  return (
    <button
      className={`${className} bg-primary text-primary-white rounded-xl`}
      onClick={() => goHomeButton ? router.replace("/") : router.back()}
    >
      <ArrowSvg />
    </button>
  );
};

export default GoBackButton;
