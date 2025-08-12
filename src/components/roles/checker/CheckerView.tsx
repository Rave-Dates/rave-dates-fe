"use client"

import TitleCard from "@/components/common/TitleCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import Image from "next/image"
import { formatDateToColombiaTime } from "@/utils/formatDate"
import { useEventImage } from "@/hooks/admin/queries/useEventImage"
import SpinnerSvg from "@/components/svg/SpinnerSvg"
import { useAdminEvent } from "@/hooks/admin/queries/useAdminData"
import ControllerPanelSection from "@/components/roles/controller/ControllerPanelSection"
import { useRouter, useSearchParams } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { useEffect, useMemo, useState } from "react"
import { useReactiveCookiesNext } from "cookies-next"
import { notifyError } from "@/components/ui/toast-notifications"

export default function ControllerEventDetails() {
  const { getCookie, setCookie } = useReactiveCookiesNext();
  const params = useSearchParams();
  const router = useRouter();

  const [cookiesToken, setCookiesToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const urlToken = params.get("token");

  // Leer cookie token una sola vez en client
  useEffect(() => {
    const t = getCookie("token");
    setCookiesToken(t ? t.toString() : null);
  }, [getCookie]);

  const safeDecode = (token?: string | null) => {
    if (!token) return null;
    try {
      return jwtDecode<IUserLogin>(token);
    } catch {
      return null;
    }
  };

  const decodedUrlToken = useMemo(() => safeDecode(urlToken), [urlToken]);
  const decodedCookieToken = useMemo(() => safeDecode(cookiesToken), [cookiesToken]);

  const validToken =
    decodedUrlToken?.role === "CHECKER"
      ? urlToken
      : decodedCookieToken?.role === "CHECKER"
      ? cookiesToken
      : undefined;

  useEffect(() => {
    // Evitar ejecutar hasta tener las cookies leídas
    if (cookiesToken === null && urlToken === null) return;

    if (!validToken) {
      router.replace("/");
    }
    setLoadingAuth(false);
  }, [validToken, cookiesToken, urlToken, router]);

  useEffect(() => {
    if (decodedUrlToken?.role === "CHECKER" && urlToken) {
      setCookie("token", urlToken, { path: "/", maxAge: 60 * 60 * 74 });
      setCookiesToken(urlToken);

      // Limpiar parámetro de la URL sin recargar
      router.replace(window.location.pathname);
    }
  }, []);

  // si esta 10 segundos sin verificarse, lo redirije
  useEffect(() => {
    if (loadingAuth && !cookiesToken && !urlToken) {
      const timeout = setTimeout(() => {
        notifyError("No se pudo autenticar");
        router.replace("/");
      }, 8000); 

      return () => clearTimeout(timeout);
    }
  }, [loadingAuth, cookiesToken, urlToken, router]);

  const validDecodedToken = useMemo(() => safeDecode(validToken), [validToken]);

  const { servedImageUrl, isImageLoading } = useEventImage({
    eventId: validDecodedToken?.eventId,
    token: validToken ?? undefined,
  });

  const { selectedEvent, isEventLoading } = useAdminEvent({
    eventId: validDecodedToken?.eventId,
    token: validToken ?? undefined,
  });

  if (loadingAuth) {
    return (
      <div className="bg-primary-black min-h-screen flex flex-col text-primary-white pt-10 rounded-lg p-4 items-center">
        <h1>Verificando acceso...</h1>
      </div>
    );
  }

  return (
    <div className="bg-primary-black min-h-screen flex flex-col text-primary-white pt-10 rounded-lg p-4 items-center">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3" />

      <div className="flex py-4 px-5 w-full mt-16 bg-input rounded-lg flex-col items-start justify-center">
        {selectedEvent && !isEventLoading && (
          <TitleCard className="pb-4 bg-input" title={selectedEvent.title} description={selectedEvent.subtitle}>
            {isImageLoading ? (
              <div className="w-15 h-15 flex items-center justify-center bg-main-container rounded-full">
                <SpinnerSvg className="fill-primary text-inactive w-4" />
              </div>
            ) : (
              <Image
                className="w-15 h-15 rounded-full"
                src={servedImageUrl ?? "/images/event-placeholder.png"}
                width={60}
                height={60}
                alt="logo"
              />
            )}
          </TitleCard>
        )}

        {!selectedEvent && isEventLoading && (
          <div className="w-full pb-4 rounded-xl gap-x-4 flex items-center justify-start">
            <div className="w-15 h-15 animate-pulse bg-inactive rounded-full"></div>
            <div className="flex flex-col gap-y-2 items-start justify-center">
              <div className="w-44 h-4 animate-pulse bg-inactive rounded"></div>
              <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
            </div>
          </div>
        )}

        <div className="flex pt-4 w-full justify-between border-t-2 border-inactive border-dashed items-center gap-x-4">
          <h2 className="text-text-inactive">Fecha y hora</h2>
          <h2 className="text-end">
            {selectedEvent && formatDateToColombiaTime(selectedEvent?.date).date} -{" "}
            {selectedEvent && formatDateToColombiaTime(selectedEvent?.date).time}hs
          </h2>
        </div>
      </div>

      <ControllerPanelSection token={validToken} eventId={validDecodedToken?.eventId} />
    </div>
  );
}
