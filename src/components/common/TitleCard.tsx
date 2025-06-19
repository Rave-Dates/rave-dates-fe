import Image from "next/image";

type Props = {
  title: string;
  description: string;
  className?: string;
};

export default function TitleCard({ title, description, className = "px-4 py-3 rounded-xl" }: Props) {

  return (
    <div className={`${className} bg-cards-container flex gap-x-4`}>
      <Image className="w-14 h-14" src="/logo.svg" width={1000} height={1000} alt="logo" />
      <div className="flex flex-col items-start justify-center">
        <h2 className="text-xl font-medium">{title}</h2>
        <h3 className="text-text-inactive">{description}</h3>
      </div>
    </div>
  );
}
