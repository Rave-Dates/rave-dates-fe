import GoBackButton from "@/components/ui/buttons/GoBackButton";
import type React from "react";

export default function DefaultForm({
  children,
  handleSubmit,
  title,
}: {
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
}) {
  return (
    <div className="min-h-screen pb-28 pt-14 sm:py-32 bg-primary-black sm:justify-center sm:items-center text-white flex px-6">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full max-w-2xl animate-fade-in pt-14 sm:pt-0">
        <h1 className="text-title font-bold mb-6">{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}
