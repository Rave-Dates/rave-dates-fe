import { OrganizerEventDetails } from "@/components/roles/organizer/organizer-event/OrganizerEventDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <OrganizerEventDetails eventId={eventIdNumber} />
}