import React from 'react';

const EventInfo= ({ labels, genres, artist } : { labels: IEventCard['labels'], genres: IEventCard['genres'], artist: IEventCard['artist'] }) => {
  return (
    <div className="space-y-6">
      {/* About Event */}
      <div>
        <h2 className="text-small-title font-bold text-white mb-3">Acerca del evento</h2>
        <p className="text-text-inactive text-body">
          Lorem ipsum dolor sit amet consectetur. Id mi sagittis rhoncus diam gravida nibh vitae 
          pellentesque. Turpis adipiscing magna amet lorem porta consequat sit dui leo. Amet 
          enim sed quam consectetur at nibh. Scelerisque pretium tortor ullamcorper convallis 
          ullamcorper duis ut rhoncus. Diam viverra ut dictum. Diam viverra ut dictum ut dictum 
          turpis urna magna. Libero tellus.
        </p>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-3">Información adicional</h3>
        <div className="flex flex-wrap gap-2">
          {labels.map((label, index) => (
            <span key={index} className="bg-primary text-black px-3 py-1.5 rounded-xl text-sm">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Organizer */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-2">Organizador</h3>
        <p className="text-primary-white text-body bg-cards-container px-4 py-3 rounded-lg">
          {artist}
        </p>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-small-title font-semibold text-white mb-3">Géneros</h3>
        <div className="flex gap-2">
          {genres.map((genre, index) => (
            <span key={index} className="bg-primary text-black px-3 py-1.5 rounded-xl text-sm">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventInfo;