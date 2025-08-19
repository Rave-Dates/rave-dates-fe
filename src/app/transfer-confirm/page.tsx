import { Suspense } from "react";
import TransferConfirmView from "@/components/containers/tickets/transfer-confirm/TransferConfirmView";
import Fallback from "@/components/ui/Fallback";

export default function TransferConfirmPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <TransferConfirmView />
    </Suspense>
  );
}
