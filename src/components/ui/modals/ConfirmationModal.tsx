"use client";

import React, { useEffect, useState } from "react";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import { notifySuccess } from "../toast-notifications";

interface ConfirmationModalProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm?: () => void;
  isLogout?: boolean;
  variant?: "danger" | "primary";
  showModal?: boolean;
}

export default function ConfirmationModal({
  trigger,
  title,
  description,
  confirmText,
  onConfirm,
  isLogout = false,
  variant = "danger",
  showModal = false,
}: ConfirmationModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCookie } = useReactiveCookiesNext();
  const router = useRouter();

  const handleConfirm = () => {
    if (isLogout) {
      notifySuccess("Sesión cerrada correctamente");
      deleteCookie("token");
      deleteCookie("isPromoter")
      router.push("/admin");
    }

    if (onConfirm) {
      onConfirm();
    }

    setIsModalOpen(false);
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className={showModal ? "" : "hidden"}>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cards-container mx-4 flex w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-divider text-primary-white shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-text-inactive text-sm">
                {description}
              </p>
            </div>

            <div className="flex border-t border-divider">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 border-r border-divider py-4 font-medium transition-colors hover:bg-primary-white/5 active:bg-primary-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className={`${
                  variant === "danger" ? "text-system-error" : "text-primary"
                } w-1/2 py-4 font-bold transition-colors hover:bg-white/5 active:bg-white/10`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
