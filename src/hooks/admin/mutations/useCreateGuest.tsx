import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useReactiveCookiesNext } from "cookies-next";
import { createGuest } from "@/services/admin-users";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@/services/clients-login";

export function useCreateGuest() {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IFormGuest) => {
      const {quantity, ticketTypeId, ...guestData } = formData;

      const createdClient = await createClient(guestData);
      const decoded: IUserLogin = await jwtDecode(createdClient);

      const createdGuest = await createGuest({
        token,
        quantity,
        ticketTypeId,
        clientId: decoded.id,
      });

      return createdGuest;
    },
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.log(error)
    },
  });
}
