"use client"

import QRSvg from "@/components/svg/QRSvg";
import { CookieValueTypes } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link";
import { CircularProgress } from "../organizer/create-event/ProgressCircular";
import { ParamValue } from "next/dist/server/request/params";

type Props = {
  eventId: number;
  token: string | null;
}

export default function ControllerPanelSection({ token }: Props) {
  // const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  return (
    <div className="rounded-lg text-white w-full flex items-start justify-center mb-24 h-full">
      <div className="w-full h-full">
        <Link href="/checker/scan-qr" className="bg-input h-[400px] flex justify-center items-center px-2 py-1 rounded-lg mt-3">
          <QRSvg />
        </Link>
        <div className="bg-input h-[80px] flex px-5 justify-between items-center py-1 rounded-lg mt-3">
          <div>
            <h3 className="text-sm text-primary-white/50">Total leídos</h3>
            <h3 className="text-lg">200/400</h3>
          </div>

          <CircularProgress current={200} total={400} />
        </div>
        <button
          type="submit"
          form="filter-form"
          className="w-full bg-primary mt-5 text-black py-4 rounded-lg font-medium hover:opacity-85 transition-opacity"
        >
          Ver escaneados
        </button>
      </div>
    </div>
  )
}
