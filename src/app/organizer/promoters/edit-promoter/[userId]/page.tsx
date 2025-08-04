import EditPromoter from "@/components/roles/organizer/EditPromoter";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: number }>
}) {
  const { userId } = await params
  const promoterIdNumber = Number(userId);
  return <EditPromoter userId={promoterIdNumber} />
}