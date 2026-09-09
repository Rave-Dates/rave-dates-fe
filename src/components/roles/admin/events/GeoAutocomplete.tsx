import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const GeoAutocomplete = ({
  setValue,
  defaultGeo,
  isEditing = false,
}: {
  setValue: UseFormSetValue<IEventFormData>;
  defaultGeo?: string;
  isEditing?: boolean;
}) => {
  const {
    ready,
    value,
    setValue: setInputValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const [isActive, setIsActive] = useState(false);

  // 👇 Seteamos el valor inicial si viene geo ya cargado
  useEffect(() => {
    if (defaultGeo && !isEditing) {
      async function getGeo() {
        const results = await getGeocode({ address: defaultGeo });
        const { lat, lng } = await getLatLng(results[0]);

        const geoValue = `${lat};${lng}`;

        setValue("geo", geoValue);
        setInputValue(results[0]?.formatted_address, false);
      }
      getGeo();
    }
  }, [defaultGeo]);
  
  useEffect(() => {
    if (defaultGeo && isEditing) {
      const parts = defaultGeo.split(";");
      const latStr = parts[0];
      const lngStr = parts[1];
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (!isNaN(lat) && !isNaN(lng)) {
        // Only store the lat;lng portion — place name is handled by the separate "place" field
        const geoCoords = `${latStr};${lngStr}`;
        getGeocode({ location: { lat, lng } })
          .then((results) => {
            setValue("geo", geoCoords);
            const placeName = results[0]?.formatted_address || parts[2] || "";
            if (placeName) setInputValue(placeName);
          })
          .catch((err) => {
            // Even on error, still set the coords correctly
            setValue("geo", geoCoords);
            if (parts[2]) {
              setInputValue(parts[2]);
            }
            console.error("Error al obtener dirección a partir de coordenadas:", err);
          });
      } else {
        // Fallback if the geo is just a string without valid coordinates
        setInputValue(defaultGeo);
        setValue("geo", defaultGeo);
      }
    }
  }, [defaultGeo, isEditing, setInputValue, setValue]);

  const handleSelect = async (description: string) => {
    setInputValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    const geoValue = `${lat};${lng}`;
    setValue("geo", geoValue);
    setValue("editPlace", results[0]?.formatted_address);
  };

  return (
    <div className="relative">
      <h2 className="text-xs">Geolocalización</h2>
      <input
        type="text"
        className="w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white"
        value={value}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onClick={() => setIsActive(true)}
        disabled={!ready}
        placeholder="Buscar ubicación"
      />
      {status === "OK" && isActive && (
        <ul className="absolute z-10 w-full bg-main-container border-divider border mt-1 rounded shadow">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="p-2 cursor-pointer hover:bg-cards-container"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoAutocomplete;
