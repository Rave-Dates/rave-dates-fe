import EditGuest from "@/components/roles/organizer/EditGuest";

export default async function Page({
  params,
}: {
  params: Promise<{ clientId: number }>
}) {
  const { clientId } = await params
  const clientIdNumber = Number(clientId);
  return <EditGuest clientId={clientIdNumber} />
}