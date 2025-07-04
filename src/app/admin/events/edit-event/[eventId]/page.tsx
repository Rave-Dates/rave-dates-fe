import EditEvent from "@/components/roles/admin/events/EditEvent";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <EditEvent eventId={eventIdNumber} />
}