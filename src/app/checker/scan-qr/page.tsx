'use client';

import AddSvg from '@/components/svg/AddSvg';
import { notifyError } from '@/components/ui/toast-notifications';
import { useAdminGetCheckerById } from '@/hooks/admin/queries/useAdminData';
import { readQr } from '@/services/admin-qr';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { CameraDevice, Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ScanQRPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{ 
    success: boolean; 
    text: string; 
    userName?: string; 
    ticketName?: string;
    clientEmail?: string;
    lastModified?: string;
  } | null>(null);
  const isProcessingRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const token = getCookie('token');
  const qrCodeRegionId = 'qr-reader';

  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  const { checker } = useAdminGetCheckerById({ token: token?.toString(), userId: decoded.id });

  const parseTicketMessage = (message: string) => {
    if (!message) return {};
    const lastModifiedMatch = message.match(/lastModified:\s*(.*?)\s*clientId:/);
    const clientNameMatch = message.match(/clientName:\s*(.*?)\s*clientEmail:/);
    const clientEmailMatch = message.match(/clientEmail:\s*(.*)$/);

    return {
      lastModified: lastModifiedMatch ? lastModifiedMatch[1].trim() : undefined,
      userName: clientNameMatch ? clientNameMatch[1].trim() : undefined,
      clientEmail: clientEmailMatch ? clientEmailMatch[1].trim() : undefined,
    };
  };

  const handleCloseModal = () => {
    setScanResult(null);
    isProcessingRef.current = false;
    scannerRef.current?.resume();
  };

  useEffect(() => {
    if (!token) {
      notifyError('No se pudo autenticar correctamente');
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
          
          // Buscar cámara trasera por el label
          const backCamera = devices.find((cam) => {
            const label = cam.label.toLowerCase();
            return label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('trasera');
          });

          setCurrentCameraId(backCamera ? backCamera.id : devices[0].id);
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
              if (!token || !checker?.checker) {
                throw new Error("Token o checkerId no encontrados");
              }
              const res = await readQr({
                token,
                qr: decodedText,
                controllerId: checker?.checker?.checkerId,
              });

              console.log('📦 Respuesta API:', res);
              
              const extraInfo = parseTicketMessage((res as any).message);

              setScanResult({ 
                success: true, 
                text: `Ticket leído correctamente`,
                ticketName: res?.ticketType?.name || 'Boleta Desconocida',
                ...extraInfo
              });
            } catch (error) {
              const err = error as AxiosError<{ message: string }>;

              if (err.response?.data.message === "Checker not allowed to read this ticket") {
                setScanResult({ success: false, text: 'No tienes permiso para leer este ticket' });
                return
              }
              if (err.response?.data.message.includes("Ticket already used")) {
                const extraInfo = parseTicketMessage(err.response.data.message);

                setScanResult({ 
                  success: false, 
                  text: 'Ticket ya utilizado',
                  ...extraInfo
                });
                return
              }

              console.error('Error al procesar QR:', err);
              setScanResult({ success: false, text: 'QR Inválido o error al procesar' });
            } finally {
              setLoading(false);
              scannerRef.current?.pause(true);
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
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-start pt-10 pb-32 relative">
      <h1 className="text-2xl mb-4">Escanear QR</h1>

      <div className="mb-4 flex items-center justify-center flex-col gap-y-3">
        <label className="mr-2">Seleccionar cámara:</label>
        <select
          onChange={handleCameraChange}
          value={currentCameraId || ''}
          className="text-primary-white bg-transparent border p-2 rounded-lg border-primary/70 outline-none"
        >
          {cameras.map((cam) => (
            <option className="bg-primary-black" key={cam.id} value={cam.id}>
              {cam.label || `Cámara ${cam.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex text-sm py-4 px-5 gap-y-2 w-full max-w-sm mb-5 bg-[#17171e] rounded-lg flex-col items-center justify-center">
        Tickets habilitados para escanear
        <div className="flex flex-wrap justify-center gap-3 text-primary-white text-sm font-medium">
          {
            checker?.checker?.ticketTypeIds?.map((ticketType) => (
              <div key={ticketType.ticketTypeId} className="flex items-center gap-x-2">
                <div className="bg-neutral-700 rounded-lg px-3 py-1">{ticketType.name}</div>
              </div>
            ))
          }
          {
            (checker?.checker?.ticketTypeIds?.length === 0 || !checker?.checker?.ticketTypeIds) &&
              <div className="flex items-center gap-x-2">
                <div className="bg-inactive text-primary-white rounded-lg px-4 py-0.5">No puedes leer tickets de este evento</div>
              </div>
          }
        </div>
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
            className={`max-w-xs border w-full px-6 py-4 rounded-lg text-center relative ${
              scanResult.success 
              ? 'border-green-600 brightness-150 text-green-600' 
              : scanResult.text === "No tienes permiso para leer este ticket" 
                ? "border-[#FFD64D] text-[#FFD64D]"
                : "border-system-error brightness-150  text-system-error"
            } shadow-lg`}
          >
            <button 
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors  font-bold"
            >
              <AddSvg className="rotate-45 w-8 h-8" />
            </button>
            <p className="text-lg font-semibold">{scanResult.text}</p>
            {scanResult.userName && (
              <div className="mt-4 flex flex-col items-center justify-center gap-y-2">
                <span className="text-sm font-medium text-white/80">
                  {scanResult.success ? "Asistente:" : "Fue usado por:"}
                </span>
                <span className="text-xl font-bold text-white">{scanResult.userName}</span>
                
                {scanResult.clientEmail && (
                  <span className="text-sm text-white/60">{scanResult.clientEmail}</span>
                )}

                {scanResult.lastModified && (
                  <span className="text-xs text-white/40 mt-1">
                    Leído el: {new Date(scanResult.lastModified).toLocaleString('es-CO', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}

                {scanResult.ticketName && (
                  <div className="bg-neutral-700 text-primary-white px-3 py-1 rounded-lg text-sm font-bold mt-2">
                    {scanResult.ticketName}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !scanResult && !isScanning && (
        <p className="mt-4 text-red-400">Esperando cámara...</p>
      )}
    </div>
  );
}
