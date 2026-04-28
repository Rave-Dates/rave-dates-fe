import EventCardList from "@/components/containers/home/EventCardList";
import CitySelectorModal from "@/components/ui/modals/CitySelectorModal";

export default function Home() {
  return (
    <>
      <CitySelectorModal />
      <EventCardList />
    </>
  );
}
