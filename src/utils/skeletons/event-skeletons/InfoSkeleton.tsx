const InfoSkeleton = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* About Event */}
      <div>
        <h2 className="text-small-title font-bold text-white mb-3">Acerca del evento</h2>
        <p className="bg-inactive animate-pulse h-14 w-full rounded"></p>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-3">Información adicional</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary animate-pulse h-8 w-13 px-3 py-1.5 rounded-xl"></span>
          <span className="bg-primary animate-pulse h-8 w-13 px-3 py-1.5 rounded-xl"></span>
          <span className="bg-primary animate-pulse h-8 w-13 px-3 py-1.5 rounded-xl"></span>
        </div>
      </div>

      {/* Organizer */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-2">Organizador</h3>
        <p className="bg-cards-container animate-pulse h-[45px] w-full rounded-lg"></p>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-3">Géneros</h3>
        <div className="flex gap-2">
          <span className="bg-primary animate-pulse h-8 w-13 px-3 py-1.5 rounded-xl"></span>
        </div>
      </div>
    </div>
  );
};

export default InfoSkeleton;