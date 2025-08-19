import { Suspense } from "react";
import OtpVerificationView from "@/components/containers/otp/OtpVerificationView";
import Fallback from "@/components/ui/Fallback";

export default function OtpPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <OtpVerificationView />
    </Suspense>
  );
}
