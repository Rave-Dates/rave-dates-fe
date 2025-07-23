import EventTicketDetails from "@/components/containers/event-ticket-detail/EventTicketDetail"

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  return <EventTicketDetails eventId={Number(eventId)} />
}