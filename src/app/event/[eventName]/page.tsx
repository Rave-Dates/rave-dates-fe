import EventDetails from "@/components/containers/event-detail/EventDetail"

export default async function Page({
  params,
}: {
  params: Promise<{ eventName: string }>
}) {
  const { eventName } = await params
  return <EventDetails eventName={eventName} />
}