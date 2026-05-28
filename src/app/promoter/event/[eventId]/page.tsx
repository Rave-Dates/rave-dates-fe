import { OrganizerEventDetails } from "@/components/roles/organizer/organizer-event/OrganizerEventDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return (
    <div className="bg-primary-black min-h-screen w-full">
      <div className="max-w-md mx-auto w-full relative">
        <OrganizerEventDetails isPromoter={true} eventId={eventIdNumber} />
      </div>
    </div>
  )
}