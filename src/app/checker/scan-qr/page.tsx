'use client';

import { notifyError } from '@/components/ui/toast-notifications';
import { readQr } from '@/services/admin-qr';
import { getCookie } from 'cookies-next';
import { CameraDevice, Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ScanQRPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; text: string } | null>(null);
  const isProcessingRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const token = getCookie('token');
  const qrCodeRegionId = 'qr-reader';

  useEffect(() => {
    if (!token) {
      notifyError('No se pudo leer el token de autenticación');
      router.replace('/');
    }
  }, [token, router]);
  
  // Montaje y obtención de cámaras
  useEffect(() => {
    let mounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (mounted && devices.length) {
          setCameras(devices);
          setCurrentCameraId(devices[0].id);
        }
      })
      .catch((err) => {
        console.error('No se pudo acceder a las cámaras:', err);
      });

    scannerRef.current = new Html5Qrcode(qrCodeRegionId);

    return () => {
      mounted = false;
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            setIsScanning(false);
            return scannerRef.current?.clear();
          })
          .catch(() => {
            // ignorar si ya estaba detenido
          });
      }
    };
  }, []);

  // Iniciar escaneo cuando cambia la cámara
  useEffect(() => {
    if (!currentCameraId || !scannerRef.current) return;

    const startScanner = async () => {
      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      try {
        if (isScanning) {
          await scannerRef.current?.stop().catch(() => {});
          scannerRef.current?.clear()
          setIsScanning(false);
        }

        await scannerRef.current?.start(
          currentCameraId,
          config,
          async (decodedText) => {
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;
            setLoading(true);

            try {
              const res = await readQr({
                token,
                qr: decodedText,
                controllerId: 1,
              });

              console.log('📦 Respuesta API:', res);
              setScanResult({ success: true, text: `QR válido` });
            } catch (err) {
              console.error('Error al procesar QR:', err);
              setScanResult({ success: false, text: 'QR Inválido o error al procesar' });
            } finally {
              setLoading(false);
              scannerRef.current?.pause(true);

              setTimeout(() => {
                setLoading(false);
                setScanResult(null);
                isProcessingRef.current = false;
                scannerRef.current?.resume();
              }, 3000);
            }
          },
          () => {}
        );

        setIsScanning(true);
      } catch (err) {
        console.error('Error al iniciar escaneo:', err);
      }
    };

    startScanner();
  }, [currentCameraId]);

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentCameraId(event.target.value);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-start pt-10 relative">
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

      {loading && (
        <div className="fixed inset-0 flex gap-x-3 items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Procesando QR...
        </div>
      )}

      {/* Modal */}
      {scanResult && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className={`max-w-xs border w-full px-6 py-4 rounded-lg text-center ${
              scanResult.success ? 'border-green-600 brightness-150 text-green-600' : 'border-system-error brightness-150  text-system-error'
            } shadow-lg`}
          >
            <p className="text-lg font-semibold">{scanResult.text}</p>
          </div>
        </div>
      )}

      {!loading && !scanResult && !isScanning && (
        <p className="mt-4 text-red-400">Esperando cámara...</p>
      )}
    </div>
  );
}
