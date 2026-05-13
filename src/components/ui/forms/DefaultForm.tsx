import GoBackButton from "@/components/ui/buttons/GoBackButton";
import type React from "react";

type Props = {
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
  goBackButton?: boolean;
  goHomeButton?: boolean;
  className?: string;
  isPending?: boolean;
  autocomplete?: "off" | "on";
};

export default function DefaultForm({
  children,
  handleSubmit,
  title,
  goBackButton = true,
  goHomeButton = false,
  className = "min-h-screen pb-40 sm:pb-32 px-6",
  isPending,
  autocomplete = "on",
}: Props) {
  return (
    <div className={`${className} pt-28 lg:pt-32 bg-primary-black md:justify-center md:items-center text-white flex`}>
      {goBackButton && (
        <GoBackButton goHomeButton={goHomeButton} className="absolute z-30 top-10 lg:top-32 left-5 px-3 py-3 animate-fade-in" />
      )}
      <div className="w-full max-w-2xl relative animate-fade-in">
        <h1 className={`${isPending && "bg-inactive text-inactive w-fit rounded-lg animate-pulse"} text-title font-bold mb-6`}> 
          {title}
        </h1>
        <form autoComplete={autocomplete} onSubmit={handleSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}
