import { Suspense } from "react";
import Checkout from "@/components/containers/checkout/CheckoutView";
import Fallback from "@/components/ui/Fallback";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <Checkout />
    </Suspense>
  );
}
