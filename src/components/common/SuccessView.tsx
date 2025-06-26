import SuccessCheckSvg from "@/components/svg/SuccessCheckSvg";
import Link from "next/link";
import type React from "react";

export default function SuccessView({
  title,
  link1,
  link2,
  gap = "gap-20 sm:gap-14",
}: {
  title: string;
  link1?: { href: string; text: string };
  link2: { href: string; text: string };
  gap?: string;
}) {
  return (
    <div className={`min-h-screen pb-32 pt-20 sm:pb-24  bg-primary-black ${gap} flex flex-col justify-between sm:justify-center items-center text-white`}>
      <div className="flex flex-col mt-20 animate-fade-in w-full items-center justify-center">
        <SuccessCheckSvg className="text-primary" />
        <p className="w-52 text-center text-text-inactive">
          {title}
        </p>
      </div>

      <div className="flex animate-fade-in flex-col w-full px-4 max-w-md">
        {
          link1 &&
          <Link
            href={link1.href}
            className="text-primary-white mb-0 py-4 text-center w-full block"
          >
            {link1.text}
          </Link>
        }
        <Link
          href={link2.href}
          className="bg-primary text-center text-black mt-1 input-button"
        >
          {link2.text}
        </Link>
      </div>
    </div>
  );
}
