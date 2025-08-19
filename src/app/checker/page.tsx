import { Suspense } from "react";
import ControllerEventDetails from "@/components/roles/checker/CheckerView";
import Fallback from "@/components/ui/Fallback";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <ControllerEventDetails />
    </Suspense>
  );
}
