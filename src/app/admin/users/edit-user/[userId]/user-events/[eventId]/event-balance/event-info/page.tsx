import { Suspense } from "react";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import EventInfo from "@/components/roles/admin/events/EventInfo";

export default function Page() {
  return (
    <Suspense fallback={<div className="relative min-h-screen w-full"><SpinnerSvg className="text-primary absolute inset-0 fill-inactive w-10" /></div>}>
      <EventInfo />
    </Suspense>
  );
}
