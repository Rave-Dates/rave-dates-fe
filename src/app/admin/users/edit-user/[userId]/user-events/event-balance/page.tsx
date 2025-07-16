import GoBackButton from "@/components/ui/buttons/GoBackButton";

const sampleData = {
  id: 1,
  eventName: "Evento 1 - 10/05",
  commission: 5,
  tickets: [
    { id: 1, name: "General", price: 125000, amount: 1200 },
    { id: 2, name: "VIP", price: 200000, amount: 300 },
    { id: 3, name: "Bakcstage", price: 180000, amount: 40 },
  ],
};

const stats = [
  { id: 1, name: "Total", price: 125000 },
  { id: 2, name: "Comisión RD", price: 70000 },
  { id: 3, name: "Comisión promotores", price: 120000 },
  { id: 4, name: "NETO", price: 215000 },
  { id: 5, name: "Retirado", price: 50000 },
  { id: 6, name: "DISPONIBLE", price: 165000 },
]

export default function Page() {
  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          <h1 className="text-title font-semibold">Saldo y movimientos</h1>
          <h2 className="text-xl text-primary">{sampleData.eventName}</h2>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
              <div className="text-start">Entrada</div>
              <div className="text-end">Cantidad</div>
              <div className="text-end">Monto</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-divider w-full">
              {sampleData.tickets.map((data) => (
                <div
                  key={data.id}
                  className="grid grid-cols-[1fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-xs"
                >
                  <div className="text-start">{data.name}</div>
                  <div className="text-end tabular-nums">
                    {data.amount.toLocaleString("es-ES")}
                  </div>
                  <div className="text-end tabular-nums">
                    ${data.price.toLocaleString("es-ES")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 max-w-xl self-center w-full animate-fade-in">
        {
          stats.map((data) => (
            <div key={data.id} className="flex justify-between text-sm gap-y-2 py-3 px-3">
              <div className="text-text-inactive">
                {data.name}
              </div>
              <div className={`${data.name === "DISPONIBLE" ? "text-primary" : "text-primary-white"} tabular-nums`}>
                ${data.price.toLocaleString("es-ES")}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
