type Props = {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

export default function TitleCard({ title, description, className = "px-4 py-3 rounded-xl", children }: Props) {

  return (
    <div className={`${className} bg-cards-container flex gap-x-4`}>
      {children}
      <div className="flex flex-col items-start justify-center">
        <h2 className="text-xl font-medium">{title}</h2>
        <h3 className="text-text-inactive">{description}</h3>
      </div>
    </div>
  );
}
