export default function EventDetails() {
  return (
    <div className="bg-cards-container rounded-lg p-4">
      <div className="flex items-center gap-3 pb-2 mb-4 border-dashed border-inactive border-b-2">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-bold">D</div>
        <div>
          <div className="font-medium">DYEN</div>
          <div className="text-sm text-text-inactive">Extended set</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-primary-white/50">Fecha y hora</span>
          <span className="text-end">Vie. 11 de jun. 08:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary-white/50">Ubicación</span>
          <span className="text-end">Movistar Arena, Bogotá</span>
        </div>
      </div>
    </div>
  );
}
