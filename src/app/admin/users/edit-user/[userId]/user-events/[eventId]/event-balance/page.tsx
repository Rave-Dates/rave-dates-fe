import EventBalance from "@/components/roles/admin/users/EventBalance";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: number }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <EventBalance eventId={eventIdNumber} />
}