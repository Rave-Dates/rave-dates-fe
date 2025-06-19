import TitleCard from "../../common/TitleCard";

export default function EventDetails({className}: {className?: string}) {
  return (
    <div className={`${className} bg-cards-container rounded-lg p-4`}>
      <TitleCard className="b-2 pb-2 mb-4 border-dashed border-inactive border-b-2" title="DYEN" description="Extended set" />

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
