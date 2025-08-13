"use client"

import SpinnerSvg from "@/components/svg/SpinnerSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useAdminBinnacles, useServeMovementImage } from "@/hooks/admin/queries/useAdminData";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function WithdrawInfo({ paymentId }: { paymentId: number }) {
  const params = useParams();
  const eventId = Number(params.eventId);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: decoded?.organizerId ?? 0,
    token: token?.toString() ?? "",
  });

  const selectedBinnacle = organizerBinnacles?.find(b => b.eventId === eventId);

  const selectedMovement = selectedBinnacle?.movements.find(m => m.paymentId === paymentId);

  console.log(selectedMovement)

  const { movementImage, isErrorMovementImage, isLoadingMovementImage } = useServeMovementImage({ token, url: selectedMovement?.imageUrl });

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in space-y-2">
          <h2 className="text-title font-semibold">Información de retiro</h2>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Fecha</h3>
            <h2 className="text-lg font-medium">{selectedMovement && new Date(selectedMovement.createdAt).toLocaleDateString("es-ES")}</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Cantidad</h3>
            <h2 className="text-lg font-medium">COP ${selectedMovement?.paymentAmount.toLocaleString("es-ES")}</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive pb-2">Imagen</h3>
            <div className="px-5" >
              {
                movementImage && !isErrorMovementImage &&
                <Image 
                  src={movementImage}
                  className="rounded object-cover" 
                  alt="Event Avatar" 
                  width={400} 
                  height={400}
                />
              }
              {
                isErrorMovementImage &&
                <div className=" text-system-error">
                  Error al cargar la imagen
                </div>
              }
              {
                isLoadingMovementImage &&
                <div className="w-[400px] h-[400px] flex items-center justify-center bg-main-container rounded-md">
                  <SpinnerSvg className="fill-primary text-inactive w-8" />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
