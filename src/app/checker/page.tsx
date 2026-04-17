import { Suspense } from "react";
import CheckerView from "@/components/roles/checker/CheckerView";
import Fallback from "@/components/ui/Fallback";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CheckerView />
    </Suspense>
  );
}
