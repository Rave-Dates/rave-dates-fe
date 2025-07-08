import EventInfo from "@/components/roles/admin/events/EventInfo";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <EventInfo eventId={eventIdNumber} />
}