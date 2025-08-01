import { UseFormSetValue } from "react-hook-form";

const LabelTagButton = ({
  watchedLabels,
  labelsTypes,
  title,
  setValue,
}: {
  watchedLabels: IEventLabel[];
  labelsTypes: IEventLabel[];
  title: string;
  setValue: UseFormSetValue<IEventFormData>;
}) => {
  const toggle = (item: IEventLabel) => {
    const updated = watchedLabels.map((l) => l.labelId).includes(item.labelId)
      ? watchedLabels.filter((l) => l.labelId !== item.labelId)
      : [...watchedLabels, item];
    setValue("labels", updated);
  };

  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-2">
        {title} <span className="text-gray-500">({watchedLabels?.length || 0})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {labelsTypes?.map((item) => (
          <button
            type="button"
            key={item.labelId}
            onClick={() => toggle(item)}
            className={`px-2.5 py-1.5 rounded-xl border text-sm font-normal transition-all duration-200 ${
              watchedLabels.map((l) => l.labelId).includes(item.labelId)
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

export default LabelTagButton