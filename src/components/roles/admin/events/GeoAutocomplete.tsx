import { useEffect } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const GeoAutocomplete = ({
  setValue,
  register,
  defaultGeo,
  getValues,
  isEditing = false,
}: {
  setValue: (name: string, value: any) => void;
  register: any;
  defaultGeo?: string;
  getValues: any;
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

  // 👇 Seteamos el valor inicial si viene geo ya cargado
  useEffect(() => {
    console.log(defaultGeo)
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
      const [lat, lng] = defaultGeo.split(";");
      if (lat && lng) {
        getGeocode({ location: { lat: parseFloat(lat), lng: parseFloat(lng) } })
        .then((results) => {
            setValue("geo", `${lat};${lng}`);
            const placeName = results[0]?.formatted_address;
            if (placeName) setInputValue(placeName);
          })
          .catch((err) => {
            console.error("Error al obtener dirección a partir de coordenadas:", err);
          });
      }
    }
  }, [defaultGeo]);


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
          setValue("geo", e.target.value); // actualiza también el valor en RHF
        }}
        disabled={!ready}
        placeholder="Buscar ubicación"
      />
      {status === "OK" && (
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
