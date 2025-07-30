import { Suspense } from "react";
import TransferConfirmView from "@/components/containers/tickets/transfer-confirm/TransferConfirmView";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

export default function TransferConfirmPage() {
  return (
    <Suspense fallback={<SpinnerSvg className="text-primary absolute inset-0 fill-inactive w-6" />}>
      <TransferConfirmView />
    </Suspense>
  );
}
