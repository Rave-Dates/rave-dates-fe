import EditOrganizerEvent from "@/components/roles/organizer/edit-event/EditOrganizerEvent";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <EditOrganizerEvent eventId={eventIdNumber} />
}