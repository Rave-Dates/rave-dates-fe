import React from "react";
import TrashSvg from "@/components/svg/TrashSvg";

const TrashButton = ({ className }: { className?: string }) => {
  return (
    <button
      className={`${className} bg-system-error text-primary-white rounded-xl`}
      onClick={() => confirm("Desea elminar el usuario?")}
    >
      <TrashSvg />
    </button>
  );
};

export default TrashButton;
