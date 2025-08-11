import AttendeeList from "@/components/roles/controller/AttendeeList";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const eventIdNumber = Number(eventId);
  return <AttendeeList eventId={eventIdNumber} />
}