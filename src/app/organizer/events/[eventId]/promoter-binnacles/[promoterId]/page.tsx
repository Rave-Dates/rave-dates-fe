import { OrganizerEventDetails } from "@/components/roles/organizer/organizer-event/OrganizerEventDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string, promoterId: string }>
}) {
  const { eventId, promoterId } = await params
  const eventIdNumber = Number(eventId);
  const promoterIdNumber = Number(promoterId);
  return <OrganizerEventDetails isPromoterBinnacle={true} eventId={eventIdNumber} promoterId={promoterIdNumber} />
}