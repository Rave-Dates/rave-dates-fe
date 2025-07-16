'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para que el ícono de marcador funcione bien en Next.js
type IconWithOptionalPrivateUrl = {
  _getIconUrl?: () => void;
};

delete (L.Icon.Default.prototype as IconWithOptionalPrivateUrl)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/markers/marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: undefined
});

export default function EventMap({ position, place }: { position: [number, number], place: string }) {
  if (position.length !== 2) return null;

  return (
    <>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '300px', width: '100%', zIndex: 10 }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{place}</Popup>
        </Marker>
      </MapContainer>

      <a 
        href={`https://www.google.com/maps?q=${position[0]},${position[1]}`} 
        className="text-center w-full text-body px-4 pt-4 pb-5 underline underline-offset-4 decoration-primary-white/70"
        target="_blank"
        rel="noreferrer"
      > 
        Ver en Google Maps
      </a>
    </>
  );
}
