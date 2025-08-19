import React from "react";
import SpinnerSvg from "../svg/SpinnerSvg";

const Fallback = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SpinnerSvg className="fill-primary text-inactive w-10 h-10 animate-spin" />
    </div>
  );
};

export default Fallback;
