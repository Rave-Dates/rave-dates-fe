import { Suspense } from "react";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import Checkout from "@/components/containers/checkout/CheckoutView";

export default function Page() {
  return (
    <Suspense fallback={<SpinnerSvg className="text-primary absolute inset-0 fill-inactive w-6" />}>
      <Checkout />
    </Suspense>
  );
}
