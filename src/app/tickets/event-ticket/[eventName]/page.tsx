import EventDetails from "@/components/containers/event-detail/EventDetail"

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  return <EventDetails isTicketList={true} eventId={eventId} />
}