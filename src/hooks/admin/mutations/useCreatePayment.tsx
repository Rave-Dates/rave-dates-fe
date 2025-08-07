import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useReactiveCookiesNext } from "cookies-next";
import { createPayment, createPaymentImage } from "@/services/admin-payments";

export function useCreatePayment() {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IPaymentForm) => {
      const { image, eventId, ...paymentData } = formData;

      console.log("form data desde hook",formData)

      if (!image) return;
      const urlImage = await createPaymentImage(token, { file: image });
      console.log("urlImage", urlImage)

      const formattedData = {
        ...paymentData,
        imageUrl: urlImage,
        eventId: Number(eventId),
      };

      console.log("formattedData", formattedData)
      const createdPayment = await createPayment(token, formattedData);

      console.log("createdPayment", createdPayment)
   
      return createdPayment;
    },
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.error("Error en el pago:", error);
    },
  });
}
