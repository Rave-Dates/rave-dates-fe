import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useReactiveCookiesNext } from "cookies-next";
import { createGuest, searchCheckerUser } from "@/services/admin-users";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@/services/clients-login";
import { useParams } from "next/navigation";

export function useCreateGuest() {
  const { getCookie } = useReactiveCookiesNext();
  const { eventId } = useParams();
  const token = getCookie("token");
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: IFormGuest) => {
      const {quantity, ticketTypeId, ...guestData } = formData;
      let clientId;

      let createdClient;
      let decoded;

      try {
        createdClient = await createClient(guestData);
        decoded = await jwtDecode(createdClient);
        clientId = decoded.id;
      } catch (e: any) {
        if (e.status === 400) {
          const checkUser = await searchCheckerUser({
            token,
            search: guestData.email,
            eventId: parseInt(eventId as string, 10),
          })

          if (checkUser) {
            clientId = checkUser.clientId;
          }
        }
      }

      const createdGuest = await createGuest({
        token,
        quantity,
        ticketTypeId,
        clientId: Number(clientId),
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
