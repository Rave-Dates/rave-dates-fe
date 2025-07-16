import DownloadSvg from "@/components/svg/DownloadSvg";
import SendSvg from "@/components/svg/SendSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import type React from "react";
import DefaultTitledButton from "../buttons/DefaultTitledButton";

type Props = {
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
  goBackButton?: boolean;
  ticketButtons?: boolean;
  className?: string;
  isPending?: boolean;
};

export default function DefaultForm({
  children,
  handleSubmit,
  title,
  goBackButton = true,
  ticketButtons = false,
  className = "min-h-screen pb-40 sm:pb-32 px-6",
  isPending,
}: Props) {
  return (
    <div className={`${className} pt-14 sm:pt-44 bg-primary-black sm:justify-center sm:items-center text-white flex`}>
      {goBackButton && (
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      )}
      <div className="w-full max-w-2xl relative animate-fade-in pt-14 sm:pt-0">
        {ticketButtons ? (
          <div className="flex w-full justify-between items-center">
            <h1 className="text-title font-bold mb-6">{title}</h1>
            <div className="absolute -top-4 right-0 sm:static flex items-center justify-center gap-x-2">
              <DefaultTitledButton className="h-12">
                <SendSvg />
                <h2 className="text-[10px]">Enviar</h2>
              </DefaultTitledButton>
              <DefaultTitledButton className="h-12">
                <DownloadSvg />
                <h2 className="text-[10px]">Descargar</h2>
              </DefaultTitledButton>
            </div>
          </div>
        ) : (
          <h1 className={`${isPending && "bg-inactive text-inactive w-fit rounded-lg animate-pulse"} text-title font-bold mb-6`}> 
            {title}
          </h1>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}
