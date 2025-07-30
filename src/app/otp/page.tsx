import { Suspense } from "react";
import OtpVerificationView from "@/components/containers/otp/OtpVerificationView";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

export default function OtpPage() {
  return (
    <Suspense fallback={<SpinnerSvg className="text-primary absolute inset-0 fill-inactive w-6" />}>
      <OtpVerificationView />
    </Suspense>
  );
}