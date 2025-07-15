import { UseFormSetValue } from "react-hook-form";

const FilterTagButton = ({
  labels,
  values,
  title,
  setValue,
}: {
  labels: number[];
  values: IEventLabel[];
  title: string;
  setValue: UseFormSetValue<IEventFormData>;
}) => {
  const toggle = (item: number) => {
    const updated = labels.includes(item)
      ? labels.filter((i: number) => i !== item)
      : [...labels, item];
    setValue("labels", updated);
  };

  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-2">
        {title} <span className="text-gray-500">({labels.length})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {values?.map((item) => (
          <button
            type="button"
            key={item.labelId}
            onClick={() => toggle(item.labelId)}
            className={`px-2.5 py-1.5 rounded-xl border text-sm font-normal transition-all duration-200 ${
              labels.includes(item.labelId)
                ? "bg-primary text-primary-black hover:opacity-80"
                : "bg-transparent text-text-inactive border-inactive hover:bg-inactive hover:text-primary-white/60"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTagButton;
