"use client";

import { useEffect, useRef } from "react";

export default function BoldButtonClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Espera a que Bold esté disponible y luego escanea el DOM
    const interval = setInterval(() => {
      if (window.BoldPaymentButton) {
        window.BoldPaymentButton.initialize();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef}>
      <div
        data-bold-button
        data-bold-button="light-L"
        data-order-id="TEST-1"
        data-currency="COP"
        data-amount="30000"
        data-api-key="2OygkTwlUJIcS_IV0xB2fK_uAldgVZ58AGLqtxLOQdc"
        data-integrity-signature="f961d0c8446f164b9439d3aafbcb72854b5d7d64cc82177430c59f99eb61a5ab"
        data-redirection-url="https://ravedates.proxising.com/checkout"
        data-description="Concierto Rolling Stones XL"
        data-customer-data='{"email": "example@correo.com","fullName": "Lola Flores","phone": "3040777777","dialCode": "+57","documentNumber": "123456789","documentType": "CC"}'
        data-origin-url="https://micomercio.com/pagos/abandono/promo"
        data-render-mode="embedded"
      />
    </div>
  );
}