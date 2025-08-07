import OrganizerEventAttendees from "@/components/roles/organizer/create-event/OrganizerEventAttendees";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <OrganizerEventAttendees isPromoter={true} eventId={eventIdNumber} />
}