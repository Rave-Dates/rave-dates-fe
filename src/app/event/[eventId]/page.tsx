import EventDetails from "@/components/containers/event-detail/EventDetail"

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const eventIdNumber = parseInt(eventId, 10);
  return <EventDetails eventId={eventIdNumber} />
}