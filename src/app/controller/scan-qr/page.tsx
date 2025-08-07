'use client';

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

export default function ScanQRPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const qrCodeRegionId = 'qr-reader';

  // Obtener cámaras disponibles
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          setCurrentCameraId(devices[0].id);
        }
      })
      .catch((err) => {
        console.error('No se pudo acceder a las cámaras:', err);
      });
  }, []);

  // Iniciar escaneo cuando se selecciona una cámara
  useEffect(() => {
    if (!currentCameraId) return;

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        currentCameraId,
        config,
        (decodedText) => {
          console.log("✅ QR leído:", decodedText);
          // Aquí podés redirigir o guardar el resultado
          alert(`QR escaneado: ${decodedText}`);
        },
        (errorMessage) => {
          console.log("No se pudo leer el QR:", errorMessage);
        }
      )
      .then(() => setScanning(true))
      .catch((err) => {
        console.error("Error al iniciar el escaneo:", err);
      });

    return () => {
      html5QrCode.stop().then(() => {
        html5QrCode.clear();
        setScanning(false);
      });
    };
  }, [currentCameraId]);

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCameraId = event.target.value;
    setCurrentCameraId(selectedCameraId);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-start pt-10">
      <h1 className="text-2xl mb-4">Escanear QR</h1>

      <div className="mb-4">
        <label className="mr-2">Seleccionar cámara:</label>
        <select
          onChange={handleCameraChange}
          value={currentCameraId || ''}
          className="text-primary-white border p-2 rounded-lg border-primary/70 outline-none"
        >
          {cameras.map((cam) => (
            <option key={cam.id} value={cam.id}>
              {cam.label || `Cámara ${cam.id}`}
            </option>
          ))}
        </select>
      </div>

      <div id={qrCodeRegionId} className="w-full max-w-sm rounded overflow-hidden" />

      {!scanning && <p className="mt-4 text-red-400">Esperando cámara...</p>}
    </div>
  );
}
