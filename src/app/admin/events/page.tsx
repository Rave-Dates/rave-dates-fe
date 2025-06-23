import EditSvg from "@/components/svg/EditSvg";
import UserSvg from "@/components/svg/UserSvg";
import Link from "next/link";

const sampleData = [
  {
    id: 1,
    title: "Evento 1",
    date: "10/5",
    place: "Lugar 1"
  },
  {
    id: 2,
    title: "Evento 2",
    date: "10/7",
    place: "Lugar 2"
  },
  {
    id: 3,
    title: "Evento 3",
    date: "10/8",
    place: "Lugar 3"
  },
  {
    id: 4,
    title: "Evento 4",
    date: "10/9",
    place: "Lugar 4"
  },
]

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <Link
        href={`/`}
        className="bg-primary block text-center max-w-xl self-center text-black input-button"
      >
        Nuevo evento
      </Link>
      <div>
        <div className="max-w-xl mx-auto animate-fade-in">
          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Fecha</div>
            <div className="text-start">Título</div>
            <div className="text-end">Lugar</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {sampleData.map((data) => (
              <div
                key={data.id}
                className="grid grid-cols-[1fr_1fr_1fr_1.5fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{data.date}</div>
                <div className="text-start tabular-nums">{data.title}</div>
                <div className="text-end tabular-nums">{data.place}</div>
                <div className="flex justify-end gap-x-2">
                  <Link
                    href="/"
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                  >
                    <EditSvg className="text-xl" />
                  </Link>
                  <Link
                    href="/"
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end border border-primary text-primary"
                  >
                    <UserSvg className="text-2xl" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Empty State */}
          {sampleData.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No se encontraron usuarios
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
