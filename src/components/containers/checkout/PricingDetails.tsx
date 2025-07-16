export default function PricingDetails() {
  return (
    <div className="bg-cards-container rounded-lg p-4 space-y-3">
      <div className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
        <span className="text-primary-white/50">General X 1</span>
        <span className="text-end">$50.000 COP</span>
      </div>
      <div className="flex justify-between">
        <span className="text-primary-white/50">Servicio</span>
        <span className="text-end">$5.000 COP</span>
      </div>
      <div className="flex justify-between">
        <span className="text-primary-white/50">Ya pagado</span>
        <span className="text-end">-$105.000 COP</span>
      </div>
      <div className="flex justify-between text-lg">
        <span className="text-primary-white/50">TOTAL</span>
        <span className="text-end">$20.000 COP</span>
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Ingresa el cupón de descuento"
          className="w-full text-sm bg-inactive outline-none rounded-l-lg px-3"
        />
        <div className="bg-inactive p-2 rounded-r-lg">
          <button className="bg-[#c1ff00] text-black rounded px-4 py-2 text-sm">Aceptar</button>
        </div>
      </div>
    </div>
  );
}
