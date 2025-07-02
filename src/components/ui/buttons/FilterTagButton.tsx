const FilterTagButton = ({
  organizers,
  values,
  type,
  title,
  setValue,
}: {
  organizers: any;
  values: string[];
  type: "organizers" | "genres";
  title: string;
  setValue: any;
}) => {

  const toggle = (item: string) => {
    const updated = organizers.includes(item)
      ? organizers.filter((i: string) => i !== item)
      : [...organizers, item];
    setValue("tags", updated);
  };

  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-2">
        {title} <span className="text-gray-500">({organizers.length})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => toggle(item)}
            className={`px-2.5 py-1.5 rounded-xl border text-sm font-normal transition-all duration-200 ${
              organizers.includes(item)
                ? "bg-primary text-primary-black hover:opacity-80"
                : "bg-transparent text-text-inactive border-inactive hover:bg-inactive hover:text-primary-white/60"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTagButton;
